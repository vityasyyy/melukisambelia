import { NextRequest, NextResponse } from 'next/server'

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')

  // Phase 1: No code yet — redirect to GitHub OAuth authorize page
  if (!code) {
    const CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID
    if (!CLIENT_ID) {
      return NextResponse.json({ error: 'GITHUB_OAUTH_CLIENT_ID not set' }, { status: 500 })
    }

    const scope = searchParams.get('scope') || 'repo'
    const state = searchParams.get('state') || crypto.randomUUID()

    const params = new URLSearchParams({ client_id: CLIENT_ID, scope, state })
    return NextResponse.redirect(`${GITHUB_AUTHORIZE_URL}?${params.toString()}`)
  }

  // Phase 2: GitHub redirected back with a code — exchange it for a token
  const CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID
  const CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.json({ error: 'OAuth env vars not set' }, { status: 500 })
  }

  try {
    const ghRes = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      }),
    })

    if (!ghRes.ok) {
      return NextResponse.json({ error: 'GitHub token exchange failed' }, { status: 502 })
    }

    const tokenData = (await ghRes.json()) as { access_token?: string; error?: string; error_description?: string }

    if (tokenData.error || !tokenData.access_token) {
      const errMsg = tokenData.error_description || tokenData.error || 'Token exchange failed'
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Auth Error</title></head><body><script>
(function() {
  var msg = 'authorization:github:error:' + JSON.stringify({ message: ${JSON.stringify(errMsg)} });
  if (window.opener) { window.opener.postMessage(msg, '*'); }
  window.close();
})();
</script></body></html>`
      return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    }

    const token = tokenData.access_token
    const provider = 'github'

    // Return HTML that implements the Decap CMS (NetlifyAuthenticator) popup protocol.
    // The opener (Decap CMS admin page) will:
    //   1. Send "authorizing:github" to this popup window
    //   2. Wait for this popup to echo it back (handshake)
    //   3. Then listen for "authorization:github:success:{JSON}"
    //
    // We must:
    //   1. Listen for "authorizing:github" from the opener
    //   2. Echo it back to complete the handshake
    //   3. Then send the authorization result
    //   4. Close the popup
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Authorizing...</title></head><body>
<script>
(function() {
  var token = ${JSON.stringify(token)};
  var provider = '${provider}';
  var tokenData = JSON.stringify({ token: token, provider: provider });
  var authMsg = 'authorization:' + provider + ':success:' + tokenData;
  var handshakeMsg = 'authorizing:' + provider;
  var origin = '*';

  function handleMessage(e) {
    // Step 1: Receive handshake from opener
    if (e.data === handshakeMsg) {
      // Step 2: Echo handshake back to opener
      e.source.postMessage(e.data, e.origin);
      // Step 3: Remove this listener, send auth result after brief delay
      window.removeEventListener('message', handleMessage, false);
      setTimeout(function() {
        // Step 4: Send authorization result to opener
        if (window.opener) {
          window.opener.postMessage(authMsg, e.origin);
        }
        // Step 5: Close popup
        window.close();
      }, 100);
    }
  }

  window.addEventListener('message', handleMessage, false);

  // Fallback: if handshake doesn't arrive within 2 seconds, send result anyway
  setTimeout(function() {
    if (window.opener) {
      window.opener.postMessage(authMsg, origin);
    }
    window.close();
  }, 2000);
})();
</script></body></html>`

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch {
    return NextResponse.json({ error: 'OAuth exchange error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID
  const CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.json({ error: 'OAuth env vars not set' }, { status: 500 })
  }

  let body: { code?: string; state?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { code, state } = body

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 })
  }

  try {
    const ghRes = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        state,
      }),
    })

    if (!ghRes.ok) {
      return NextResponse.json({ error: 'GitHub token exchange failed' }, { status: 502 })
    }

    const token = (await ghRes.json()) as { access_token: string; token_type: string; scope: string }
    return NextResponse.json({
      token: token.access_token,
      provider: 'github',
    })
  } catch {
    return NextResponse.json({ error: 'OAuth exchange error' }, { status: 500 })
  }
}
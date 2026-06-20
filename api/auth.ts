import type { VercelRequest, VercelResponse } from '@vercel/node'

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'
const CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID
const CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET

interface DecapTokenResponse {
  access_token: string
  token_type: string
  scope: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return res.status(500).json({ error: 'OAuth env vars not set' })
  }

  const { code, state } = req.body ?? {}

  if (!code) {
    return res.status(400).json({ error: 'Missing code' })
  }

  try {
    const ghRes = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
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
      return res.status(502).json({ error: 'GitHub token exchange failed' })
    }

    const token = (await ghRes.json()) as DecapTokenResponse
    return res.status(200).json({
      token: token.access_token,
      provider: 'github',
    })
  } catch (err) {
    return res.status(500).json({ error: 'OAuth exchange error' })
  }
}
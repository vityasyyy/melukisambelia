# Decap CMS OAuth Setup

The CMS at `/admin` uses GitHub OAuth to authenticate editors so they can commit content changes back to the repo. Local editing (with `npx decap-server`) needs no OAuth.

## Steps to enable OAuth for production

1. **Create a GitHub OAuth App**
   - GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
   - Application name: `Melukis Sambelia CMS`
   - Homepage URL: `https://melukis-sambelia.vercel.app` (or your custom domain)
   - Authorization callback URL: `https://melukis-sambelia.vercel.app/api/auth`

2. **Copy credentials**
   - Copy the Client ID
   - Generate a Client Secret → copy it

3. **Set Vercel env vars**
   - In the Vercel dashboard → Project → Settings → Environment Variables
   - `GITHUB_OAUTH_CLIENT_ID` = your client id
   - `GITHUB_OAUTH_CLIENT_SECRET` = your client secret
   - Redeploy

4. **Verify**
   - Visit `https://melukis-sambelia.vercel.app/admin`
   - Click "Login with GitHub"
   - Authorize the OAuth app
   - You should see the Decap collections and be able to edit content

## Local editing (no OAuth needed)

```bash
# Terminal 1
npm run dev

# Terminal 2
npx decap-server
```

Open `http://localhost:3000/admin`. Decap detects `local_backend: true` in `config.yml` and edits against the local filesystem via `decap-server`. No GitHub login required.
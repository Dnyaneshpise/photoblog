# Photoblog client

Vite + React + TypeScript frontend.

## Local development

```bash
npm install
npm run dev
```

Optional: create `client/.env`:

```env
VITE_API_URL=http://localhost:4000
```

## Production (GitHub Pages — free)

Deploys automatically from `main` via `.github/workflows/deploy-pages.yml`.

- **URL:** https://dnyaneshpise.github.io/photoblog/
- **Base path:** `/photoblog/`
- **API:** `https://photoblog-api-xvy5.onrender.com`

### One-time GitHub setup

1. Repo **Settings → Pages**
2. **Source:** GitHub Actions
3. After the first workflow run succeeds, open the URL above

### Render CORS

Set API env `CLIENT_URL` to:

```text
https://dnyaneshpise.github.io
```

(Browsers treat path separately; origin is the github.io host. If admin cookies fail, use the full origin only — no path.)

Actually for credentialed CORS the `Origin` header is `https://dnyaneshpise.github.io` (no `/photoblog`). Set:

```text
CLIENT_URL=https://dnyaneshpise.github.io
```

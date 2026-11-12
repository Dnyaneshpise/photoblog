# Live deployment — Photoblog

Production stack (free tiers):

| Piece | Service | Notes |
|-------|---------|--------|
| Frontend | **Cloudflare** (Workers / Pages) | `https://photoblog.dnypi.workers.dev` |
| Backend API | **Render** | Docker service `photoblog-api` |
| PostgreSQL | **Neon** | `DATABASE_URL` on Render |
| Images | **Cloudinary** | Uploads from admin; demo seed uses Unsplash/Picsum |

Netlify is **not** required for production.

---

## 1. Database (Neon)

1. Create a project at [neon.tech](https://neon.tech).
2. Copy the connection string.
3. Set it as `DATABASE_URL` on Render.

Run migrations / seed from `server/`:

```bash
npx prisma migrate deploy
npx prisma db seed
```

Seed refreshes **demo** photos by title with public image URLs; it does not delete other photos.

---

## 2. Backend (Render)

1. Web service from GitHub `Dnyaneshpise/photoblog`, Docker, root `server` (or repo Dockerfile path as configured).
2. Environment variables:

```
DATABASE_URL=postgresql://...
SESSION_SECRET=<long random string>
CLIENT_URL=https://photoblog.dnypi.workers.dev
NODE_ENV=production
PORT=4000
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=<strong password>
```

API URL example: `https://photoblog-api-xvy5.onrender.com`

---

## 3. Frontend (Cloudflare)

Build settings when using a static/Pages-style deploy of `client/`:

| Field | Value |
|--------|--------|
| Root | `client` |
| Build | `npm run build` |
| Output | `dist` |
| Env | `VITE_API_URL=https://photoblog-api-xvy5.onrender.com` |

Do **not** set `VITE_BASE_PATH` when the site is served at domain root (`/`).

After the frontend URL is final, keep Render `CLIENT_URL` in sync (CORS + session cookies).

---

## 4. Local development

```bash
# server
cd server && cp .env.example .env   # fill secrets
npm install && npx prisma migrate dev && npm run dev

# client
cd client && npm install && npm run dev
```

Optional `client/.env`:

```
VITE_API_URL=http://localhost:4000
```

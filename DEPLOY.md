# Live deployment — Photoblog

Recommended split (simple and reliable):

| Piece        | Service (free tier OK)     | Notes                                      |
|--------------|----------------------------|--------------------------------------------|
| Frontend     | **Vercel**                 | Connect the `client/` folder               |
| Backend API  | **Railway** or **Render**  | Deploy `server/` with the included Dockerfile |
| PostgreSQL   | **Neon**, Railway, or Supabase | Paste connection string into `DATABASE_URL` |
| Images       | **Cloudinary**             | Free tier is enough to start               |

---

## 1. Database (Neon example)

1. Create a project at [neon.tech](https://neon.tech).
2. Copy the connection string.
3. Set it as `DATABASE_URL` on your API host.

---

## 2. Backend (Railway)

1. New project → Deploy from GitHub → select `Dnyaneshpise/photoblog`.
2. Root directory: `server`.
3. Railway will detect the Dockerfile.
4. Add environment variables (same names as `.env.example`):

```
DATABASE_URL=postgresql://...
SESSION_SECRET=<openssl rand -hex 32>
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=4000
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=<strong password>
```

5. After first deploy, run seed once (Railway shell or one-off):

```bash
npx prisma db seed
```

Public API URL will look like `https://photoblog-api.up.railway.app`.

---

## 3. Frontend (Vercel)

1. Import the same GitHub repo in Vercel.
2. **Root Directory:** `client`
3. Framework: Vite
4. Environment variable:

```
VITE_API_URL=https://your-api.up.railway.app
```

5. In `client/vercel.json`, replace `REPLACE_WITH_YOUR_API_URL` with your real API origin (or rely on `VITE_API_URL` in code later).

6. Deploy. Site URL: `https://photoblog-xxx.vercel.app`.

---

## 4. After deploy checklist

- [ ] `GET /api/health` returns `{ status: "ok" }`
- [ ] Admin can log in (Day 4+)
- [ ] `CLIENT_URL` matches the Vercel domain (CORS)
- [ ] Cloudinary credentials present before uploading real photos
- [ ] Change default admin password

---

## Alternative: all-in-one on Railway

You can also host a static build of the client from Express later. For now the split (Vercel + Railway) is the fastest path to a live URL.

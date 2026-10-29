# Photoblog

A premium photography portfolio — editorial, minimal, and built so the photographs stay the focus.

**Author:** Dnyanesh Pise  
**Stack:** React · TypeScript · Vite · Tailwind · Framer Motion · Express · Prisma · PostgreSQL · Cloudinary

---

## Project structure

```
photoblog/
├── client/          # Frontend (Vite + React + TypeScript + Tailwind)
├── server/          # Backend (Express + TypeScript + Prisma)
├── docker-compose.yml
├── DEPLOY.md        # Live deployment guide (Vercel + Railway/Neon)
├── .env.example
└── README.md
```

---

## Prerequisites

- Node.js 20+
- Docker (local PostgreSQL) **or** a hosted Postgres (Neon/Railway)
- Free [Cloudinary](https://cloudinary.com) account (uploads)

---

## Local setup

```bash
git clone https://github.com/Dnyaneshpise/photoblog.git
cd photoblog
cp .env.example .env
# Set SESSION_SECRET (≥ 16 chars). Optional: ADMIN_EMAIL / ADMIN_PASSWORD for seed.

docker compose up -d

cd server
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev

# new terminal
cd client
npm install
npm run dev
```

- Frontend: http://localhost:5173  
- API health: http://localhost:4000/api/health  

Default seed admin: email/password from `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`), or `admin@photoblog.local` / `changeme-please`.

---

## Live deployment

See **[DEPLOY.md](./DEPLOY.md)** for a full walkthrough:

- **Frontend** → Vercel (`client/`)
- **API** → Railway or Render (`server/` + Dockerfile)
- **Postgres** → Neon / Railway / Supabase
- **Images** → Cloudinary

After deploy: hit `/api/health`, run seed once, set `CLIENT_URL` to your Vercel domain.

---

## Development phases

| Day | Focus | Status |
|-----|--------|--------|
| 1 | Foundation (structure, design tokens) | Done |
| 2 | Prisma schema, seed, deployment docs | Done |
| 3 | Backend public API | Next |
| 4 | Admin authentication | |
| 5 | Photo/collection management + Cloudinary | |
| 6 | Design system + homepage | |
| 7 | Gallery + photograph viewer | |
| 8 | Collections, About, Contact | |
| 9 | Admin interface | |
| 10 | Settings, polish, responsive | |
| 11 | Tests & final deploy verification | |

Every method includes a short comment explaining why it exists and what it does.

---

## Design principles

- Photographs are the product; the interface never competes with them.
- Editorial typography, generous negative space, restrained color.
- No generic dashboard aesthetics or decorative noise.
- Mobile is designed intentionally.

---

## License

Private project of Dnyanesh Pise. All rights reserved unless otherwise stated.

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
├── .env.example
└── README.md
```

Separate folders keep frontend and backend independent while sharing one repository.

---

## Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL)
- A free [Cloudinary](https://cloudinary.com) account (for image uploads)

---

## Quick start (Day 1 foundation)

```bash
# 1. Clone
git clone https://github.com/Dnyaneshpise/photoblog.git
cd photoblog

# 2. Environment
cp .env.example .env
# Edit .env — at minimum set SESSION_SECRET and Cloudinary keys when you reach uploads

# 3. Database
docker compose up -d

# 4. Backend
cd server
npm install
npx prisma migrate dev   # after schema is added (Day 2)
npm run dev

# 5. Frontend (new terminal)
cd client
npm install
npm run dev
```

Frontend: http://localhost:5173  
Backend:  http://localhost:4000

---

## Development phases

| Day | Focus |
|-----|--------|
| 1 | Foundation (this commit) |
| 2 | Prisma schema, migrations, seed |
| 3 | Backend core + public API |
| 4 | Secure admin authentication |
| 5 | Photo/collection management + Cloudinary |
| 6 | Design system + homepage |
| 7 | Gallery + photograph viewer |
| 8 | Collections, About, Contact |
| 9 | Admin interface |
| 10 | Settings, polish, responsive |
| 11 | Tests, docs, deployment readiness |

Every method in the codebase includes a short comment explaining why it exists and what it does — read the code to learn the stack.

---

## Design principles

- Photographs are the product; the interface never competes with them.
- Editorial typography, generous negative space, restrained color.
- No generic dashboard aesthetics, glassmorphism, or decorative noise.
- Mobile is designed intentionally, not merely shrunk.

---

## License

Private project of Dnyanesh Pise.  
All rights reserved unless otherwise stated.

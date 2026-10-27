# Photoblog Server

Express + TypeScript + Prisma + PostgreSQL.

```bash
# from repo root
cp ../.env.example ../.env   # if not already done
docker compose up -d

cd server
npm install
npx prisma migrate dev
npm run dev
```

API: http://localhost:4000  
Health: http://localhost:4000/api/health

# HabTrack

Angel Lores  
CS 565 Full Stack Web Development

Habit + task tracker.

Monorepo:

- apps/api: Express + TypeScript + Prisma (SQLite)
- apps/web: React + TypeScript + Vite

## Run locally

1. Install

- `npm install`

2. API env

- copy `apps/api/.env.example` to `apps/api/.env`

3. Create DB

- `npm -w apps/api run db:push`

4. Start dev servers

- `npm run dev`

## URLs

- Web: http://localhost:5173
- API health: http://localhost:3001/api/health

## Notes

Will have to deploy this after all so going to swap for a hosted PostgreSQL DB later I think
Add Weather API too
Add some polish

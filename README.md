# HabTrack

Angel Lores  
CS 565 Full Stack Web Development

HabTrack is a full-stack habit and task tracker. Users can create habits/tasks, mark them complete by date, view weekly progress, and see a small weather card on the dashboard.

## Stack

- Front end: React + TypeScript + Vite
- Back end: Node.js + Express + TypeScript
- Database: PostgreSQL
- Testing: Jest + React Testing Library
- Accessibility: @axe-core/react in development

## Project structure

- `client/` → React front end
- `server/` → Express API + database access

## Local setup

1. Install dependencies
   - `npm install`
2. Create env files
   - `cp server/.env.example server/.env`
   - `cp client/.env.example client/.env.local`
3. Put your Postgres connection string in `server/.env`
4. Start both apps
   - `npm run dev`
5. Test
   - `npm test`

## Local URLs

- Client: http://localhost:5173
- Server: http://localhost:3001
- Health: http://localhost:3001/api/health

## Deployment

This class expects a deployed site URL in the journal, so deployment is part of finishing the project.

Use two Vercel projects from the same GitHub repo:

- one for `server/`
- one for `client/`

Use a hosted PostgreSQL database for production. Neon or Supabase both work. Vercel's docs say Postgres is now provided through Marketplace integrations such as Neon or Supabase.

## Outside libraries / docs used

- Express
- pg
- React Router
- Jest
- React Testing Library
- @axe-core/react
- Open-Meteo API docs
- Vercel docs

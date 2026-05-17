# Peblo AI Notes Workspace

Peblo AI Notes Workspace is a full-stack productivity app built as a monorepo. It combines secure authentication, a modern notes workspace, AI-powered note insights, public sharing, and a lightweight analytics dashboard in a clean SaaS-style product shell.

## Features

- JWT authentication with protected routes and cookie-based sessions
- Notes workspace with autosave, tagging, archiving, and sharing
- Gemini-powered summaries, action items, and title suggestions
- Public note sharing with read-only shared pages
- Productivity dashboard with recent activity, tag insights, and note analytics
- Light and dark theme support

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS, Axios
- Backend: Express 5, TypeScript, Mongoose, JWT, cookie-parser, dotenv
- Database: MongoDB
- AI: Google Gemini SDK

## Project Structure

```text
.
|-- client/   # Next.js application
|-- server/   # Express API
|-- package.json
|-- .gitignore
`-- README.md
```

## Installation

```bash
npm install
```

Create local environment files from the examples:

```bash
cp client/.env.example client/.env.local
cp server/.env.example server/.env
```

PowerShell:

```powershell
Copy-Item client/.env.example client/.env.local
Copy-Item server/.env.example server/.env
```

## Run Locally

Start the frontend:

```bash
npm run dev:client
```

Start the backend:

```bash
npm run dev:server
```

Default local URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Build

```bash
npm run build:client
npm run build:server
```

## Deployment

- Deploy `client` as a Next.js app
- Deploy `server` as a separate Node/Express service
- Configure production environment variables on both services
- Keep all `.env` files local and out of version control

## Repository Hygiene

- `.env` files are ignored by Git
- `.env.example` files remain committed for setup reference
- Build output, logs, caches, and local machine files are excluded from version control

## Scripts

- `npm run dev:client`
- `npm run dev:server`
- `npm run build:client`
- `npm run build:server`
- `npm run lint`
- `npm run start:client`
- `npm run start:server`

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Luminary is a modern full-stack TypeScript application built with the Better-T-Stack, featuring a monorepo structure managed by Turborepo. The project consists of a React frontend and a Hono/tRPC backend with PostgreSQL database.

## Architecture

### Monorepo Structure
- `apps/web/` - React frontend with TanStack Router, TailwindCSS, and shadcn/ui
- `apps/server/` - Hono backend with tRPC API, Better Auth, and Drizzle ORM
- Root workspace manages shared dependencies and build orchestration

### Key Technologies
- **Frontend**: React 19, TanStack Router, TailwindCSS v4, shadcn/ui components
- **Backend**: Hono server, tRPC for type-safe APIs, Better Auth for authentication
- **Database**: PostgreSQL with Drizzle ORM for migrations and queries
- **Tooling**: Biome (via Ultracite) for formatting/linting, TypeScript for type checking

### Authentication Flow
Authentication is handled by Better Auth with session-based auth:
- Server routes: `/api/auth/**` handled by `auth.handler`
- Protected procedures in tRPC use middleware that checks `ctx.session`
- Frontend auth client manages session state

## Development Commands

### Core Development
```bash
pnpm install          # Install all dependencies
pnpm dev              # Start both web and server in development
pnpm dev:web          # Start only web app (port 3001)
pnpm dev:server       # Start only server (port 3000)
```

### Build and Quality
```bash
pnpm build            # Build all apps for production
pnpm check-types      # TypeScript type checking across all apps
pnpm check            # Format and fix code with Biome/Ultracite
pnpm knip             # Find unused dependencies and exports
```

### Database Operations
```bash
pnpm db:push          # Push schema changes to database
pnpm db:studio        # Open Drizzle Studio for database management
pnpm db:generate      # Generate migration files
pnpm db:migrate       # Run database migrations
```

### Testing
```bash
pnpm test:server      # Run server tests
pnpm test:web         # Run web tests
```

## Code Quality Standards

This project uses Ultracite (Biome-based formatter) with strict rules for:
- Type safety and accessibility standards
- React/JSX best practices with hooks rules
- No console statements, proper error handling
- Consistent code style and import organization

Key patterns to follow:
- Use `import type` for type-only imports
- Prefer `const` assertions over type annotations
- Use proper error boundaries and error handling
- Follow existing component patterns in `apps/web/src/components/`

## Database Schema

Database schema is defined in `apps/server/src/db/schema/` with Drizzle ORM:
- Authentication tables managed by Better Auth
- Schema changes require running `pnpm db:generate` then `pnpm db:push`
- Use `pnpm db:studio` to inspect database visually

## Environment Setup

Server environment variables (in `apps/server/.env`):
- `DATABASE_URL` - PostgreSQL connection string
- `CORS_ORIGIN` - Frontend URL for CORS configuration
- Better Auth configuration variables

## Development Notes

- Web app runs on port 3001, server on port 3000
- Hot reload enabled for both frontend and backend
- tRPC provides end-to-end type safety between client and server
- Route generation for TanStack Router is automated (don't edit `routeTree.gen.ts`)
- Authentication state is managed through tRPC context and Better Auth client
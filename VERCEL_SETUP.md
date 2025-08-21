# Dual Runtime Deployment Strategy

This project uses a **dual runtime approach** for optimal development and production workflows:

- **🚀 Production**: Cloudflare Workers (edge performance)
- **🔍 Preview/Staging**: Vercel with Node.js (easy preview environments)
- **💻 Development**: Both runtimes supported

## Architecture Overview

```
┌─────────────────┬──────────────────┬─────────────────┐
│   Environment   │     Frontend     │     Backend     │
├─────────────────┼──────────────────┼─────────────────┤
│   Production    │  Cloudflare      │ Cloudflare      │
│                 │  Pages/Vercel    │ Workers         │
├─────────────────┼──────────────────┼─────────────────┤
│ Preview/Staging │     Vercel       │ Vercel Node.js  │
├─────────────────┼──────────────────┼─────────────────┤
│  Development    │     Local        │ CF Workers/Node │
└─────────────────┴──────────────────┴─────────────────┘
```

## Prerequisites

1. Install the Vercel CLI: `npm i -g vercel`
2. Create a Vercel account at [vercel.com](https://vercel.com)

## Setup Steps

### 1. Create Vercel Projects

You'll need to create two separate Vercel projects for your monorepo:

#### Web App Project

```bash
cd apps/web
vercel --scope your-team-name
# Follow the prompts:
# - Link to existing project? No
# - Project name: luminary-web
# - Directory: ./
# - Build Command: bun run build
# - Output Directory: dist
```

#### Server Project

```bash
cd apps/server
vercel --scope your-team-name
# Follow the prompts:
# - Link to existing project? No
# - Project name: luminary-server
# - Directory: ./
# - Build Command: bun run build
# - Output Directory: dist
```

### 2. Configure GitHub Secrets

Add these secrets to your GitHub repository settings:

1. `VERCEL_TOKEN` - Your Vercel authentication token

   - Get from: https://vercel.com/account/tokens

2. `VERCEL_ORG_ID` - Your Vercel organization ID

   - Found in: Project Settings → General → Organization ID

3. `VERCEL_PROJECT_ID_WEB` - Web project ID

   - Found in: Web project Settings → General → Project ID

4. `VERCEL_PROJECT_ID_SERVER` - Server project ID
   - Found in: Server project Settings → General → Project ID

### 3. Configure Environment Variables

#### Web App Environment Variables (in Vercel Dashboard)

- `VITE_API_URL` - Set to your server URL for each environment:
  - Production: `https://luminary-server.vercel.app`
  - Preview: `https://luminary-server-git-$VERCEL_GIT_COMMIT_REF.vercel.app`
  - Development: `http://localhost:3000`

#### Server Environment Variables (in Vercel Dashboard)

- `DATABASE_URL` - Your database connection string
- `DATABASE_AUTH_TOKEN` - Database authentication token
- `BETTER_AUTH_SECRET` - Random secret for authentication
- `BETTER_AUTH_URL` - Your server URL
- `CORS_ORIGIN` - Your web app URL

### 4. Update Project Settings

#### Web Project Settings

- **Build Command**: `bun run build`
- **Output Directory**: `dist`
- **Install Command**: `cd ../.. && bun install`
- **Root Directory**: `apps/web`

#### Server Project Settings

- **Build Command**: `bun run build`
- **Output Directory**: `dist`
- **Install Command**: `cd ../.. && bun install`
- **Root Directory**: `apps/server`

### 5. Configure Domain Routing (Optional)

If you want both apps under a single domain:

1. Set up your web app on your main domain (e.g., `luminary.com`)
2. Configure the web app's `vercel.json` to proxy API calls to the server
3. The current configuration already includes this setup

### 6. Test Preview Deployments

1. Create a pull request
2. The GitHub Action will automatically deploy both apps
3. Check the PR comment for preview URLs
4. Test both the web app and API endpoints

## Troubleshooting

### Build Failures

- Ensure all dependencies are properly listed in package.json
- Check that build commands work locally
- Verify environment variables are set correctly

### Environment Variable Issues

- Preview environments use the "Preview" environment in Vercel
- Production uses "Production" environment
- Development uses local .env files

### Monorepo Issues

- Ensure each project has the correct root directory set
- Install command should run from repository root to get all dependencies
- Build commands should run from the specific app directory

## Migration from Current Setup

Your current setup uses:

- Azure Static Web Apps for frontend
- Cloudflare Workers for backend

The migration benefits:

- ✅ Unified platform for both apps
- ✅ Automatic preview environments for PRs
- ✅ Better integration between frontend and backend
- ✅ Simplified deployment process
- ✅ Built-in analytics and monitoring

# Workspace

## Overview

MCView — a professional Minecraft content creator tools website built with React + Vite frontend and Express backend.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM (provisioned, no tables yet — not needed for current features)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: OpenAI gpt-image-1 via Replit AI Integrations (thumbnail generation)
- **3D rendering**: skinview3d (Minecraft skin renderer with poses)

## Artifacts

- **mcview** (`artifacts/mcview/`) — React + Vite frontend at `/`
- **api-server** (`artifacts/api-server/`) — Express backend at `/api`

## Features

1. **Homepage** — Sleek black/white landing page with hero, tool showcase, CTAs
2. **Skin Renderer** (`/tools/skin-renderer`) — Enter a Minecraft username → fetches UUID from Mojang API via backend → displays body/head/avatar renders from Crafatar + interactive 3D skinview3d viewer with pose switching (walk, run, fly, idle)
3. **Thumbnail Generator** (`/tools/thumbnail-generator`) — Enter a prompt + style → backend calls OpenAI gpt-image-1 → returns a professional Minecraft-themed thumbnail

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## API Routes

- `GET /api/minecraft/player/:username` — look up Minecraft player (UUID + skin URLs from Crafatar)
- `POST /api/thumbnail/generate` — generate AI thumbnail with OpenAI gpt-image-1

## Environment Variables

- `AI_INTEGRATIONS_OPENAI_BASE_URL` — OpenAI proxy base URL (Replit managed)
- `AI_INTEGRATIONS_OPENAI_API_KEY` — OpenAI API key (Replit managed)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

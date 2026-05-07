# QR Resto Hub

Astro + React application scaffolded for Cloudflare Workers.

## Foundation

- Astro app shell with React integration.
- Tailwind CSS v4 through the official Astro/Vite flow.
- Cloudflare adapter and Wrangler deployment config.
- D1, R2, and Durable Object bindings for `dev` and `prod`.
- Elysia, OpenAPI, Drizzle, Drizzle Kit, Vitest, and Worker runtime types.

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Start the Astro dev server. |
| `npm run typecheck` | Run Astro and TypeScript checks. |
| `npm test` | Run Vitest. |
| `npm run build` | Build for Cloudflare Workers. |
| `npm run generate-types` | Regenerate Cloudflare binding types. |
| `npm run deploy:dev` | Deploy the dev Worker environment. |
| `npm run deploy:prod` | Deploy the prod Worker environment. |
| `npm run db:migrate:dev` | Apply remote D1 migrations to dev. |
| `npm run db:migrate:prod` | Apply remote D1 migrations to prod. |

Run `npm run generate-types` after changing `wrangler.jsonc`.

# QR Resto Hub

Astro + React application scaffolded for Cloudflare Workers.

## Foundation

- Astro app shell with React integration.
- Tailwind CSS v4 through the official Astro/Vite flow.
- Cloudflare adapter and Wrangler deployment config.
- D1, R2, and Durable Object bindings for `dev` and `prod`.
- Elysia, OpenAPI, Drizzle, Drizzle Kit, Vitest, and Worker runtime types.

## Commands

| Command                         | Action                                                               |
| ------------------------------- | -------------------------------------------------------------------- |
| `npm run dev`                   | Start the Astro dev server against the Cloudflare `dev` environment. |
| `npm run typecheck`             | Run Astro and TypeScript checks.                                     |
| `npm test`                      | Run Vitest.                                                          |
| `npm run build`                 | Build for Cloudflare Workers.                                        |
| `npm run generate-types`        | Regenerate Cloudflare binding types.                                 |
| `npm run deploy:dev`            | Deploy the dev Worker environment.                                   |
| `npm run deploy:prod`           | Deploy the prod Worker environment.                                  |
| `npm run db:migrate:dev`        | Apply remote D1 migrations to dev.                                   |
| `npm run db:migrate:prod`       | Apply remote D1 migrations to prod.                                  |
| `npm run seed:super-admin:dev`  | Seed the remote dev D1 Super Admin owner from local `.env`.          |
| `npm run seed:super-admin:prod` | Seed the remote prod D1 Super Admin owner from local `.env`.         |

Run `npm run generate-types` after changing `wrangler.jsonc`.

## Local Development

`npm run dev` sets `CLOUDFLARE_ENV=dev` so Astro's Cloudflare runtime uses the `env.dev` bindings in `wrangler.jsonc`, including the remote dev D1 database. Local secrets come from `.env`.

`wrangler.jsonc` includes the project `account_id` because the local Wrangler login has multiple Cloudflare accounts available. This value is not a secret.

If `/api/openapi` fails with a stale Vite optimizer file under `node_modules/.vite/deps_ssr`, stop the dev server and delete `node_modules/.vite`; Vite will rebuild it. `astro.config.mjs` excludes `elysia` and `@elysiajs/openapi` from client dependency optimization to avoid the known missing optimized file issue.

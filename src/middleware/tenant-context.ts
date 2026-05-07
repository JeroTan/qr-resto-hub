import type { MiddlewareHandler } from "astro";

export const tenantContextMiddleware: MiddlewareHandler = (_context, next) => next();

import type { MiddlewareHandler } from "astro";

export const roleGuardMiddleware: MiddlewareHandler = (_context, next) => next();

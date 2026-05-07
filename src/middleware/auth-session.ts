import type { MiddlewareHandler } from "astro";

export const authSessionMiddleware: MiddlewareHandler = (_context, next) => next();

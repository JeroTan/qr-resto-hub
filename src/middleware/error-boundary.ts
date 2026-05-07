import type { MiddlewareHandler } from "astro";
import { apiError } from "@/lib/api/response";

export const errorBoundaryMiddleware: MiddlewareHandler = async (_context, next) => {
  try {
    return await next();
  } catch {
    return Response.json(apiError("INTERNAL_SERVER_ERROR", "An internal server error occurred."), {
      status: 500,
    });
  }
};

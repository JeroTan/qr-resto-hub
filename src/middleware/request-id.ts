import type { MiddlewareHandler } from "astro";
import { getOrCreateRequestId, REQUEST_ID_HEADER } from "@/utils/request-id";

export const requestIdMiddleware: MiddlewareHandler = async (context, next) => {
  const requestId = getOrCreateRequestId(context.request.headers);
  (context.locals as unknown as Record<string, unknown>).requestId = requestId;

  const response = await next();
  response.headers.set(REQUEST_ID_HEADER, requestId);
  return response;
};

import type { MiddlewareHandler } from "astro";
import { adEntitlementMiddleware } from "./ad-entitlement";
import { authSessionMiddleware } from "./auth-session";
import { errorBoundaryMiddleware } from "./error-boundary";
import { requestIdMiddleware } from "./request-id";
import { roleGuardMiddleware } from "./role-guard";
import { tenantContextMiddleware } from "./tenant-context";

export const middlewareOrder = [
  "request-id",
  "error-boundary",
  "auth-session",
  "tenant-context",
  "role-guard",
  "ad-entitlement",
] as const;

type StrictMiddleware = (
  context: Parameters<MiddlewareHandler>[0],
  next: () => Promise<Response>,
) => Response | Promise<Response>;

const middlewareStack: StrictMiddleware[] = [
  requestIdMiddleware,
  errorBoundaryMiddleware,
  authSessionMiddleware,
  tenantContextMiddleware,
  roleGuardMiddleware,
  adEntitlementMiddleware,
] as StrictMiddleware[];

export const onRequest: MiddlewareHandler = async (context, next) => {
  const run = async (index: number): Promise<Response> => {
    const middleware = middlewareStack[index];
    return middleware ? middleware(context, () => run(index + 1)) : next();
  };

  return await run(0);
};

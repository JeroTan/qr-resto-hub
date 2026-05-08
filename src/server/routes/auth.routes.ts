import { Elysia, t } from "elysia";
import {
  authControllerUnavailable,
  createAuthControllerFromRuntime,
} from "@/server/controllers/auth.controller";
import { astroBridgeDecorations } from "@/lib/elysia/astroBridgeContext";
import { openApiErrorResponses, tboxApiSuccess } from "@/lib/typebox/api";
import { getOrCreateRequestId } from "@/utils/request-id";

export const tboxAuthAdminUser = t.Object({
  id: t.String(),
  email: t.String(),
  roleKey: t.Union([
    t.Literal("super_admin"),
    t.Literal("platform_admin"),
    t.Literal("restaurant_admin"),
  ]),
  status: t.Union([t.Literal("active"), t.Literal("suspended")]),
});

export const tboxAuthSession = t.Object({
  expiresAt: t.String(),
});

export const tboxLoginBody = t.Object({
  email: t.String({ minLength: 3 }),
  password: t.String({ minLength: 1 }),
});

export const tboxLoginSuccess = t.Object({
  adminUser: tboxAuthAdminUser,
  session: tboxAuthSession,
});

export const tboxLogoutSuccess = t.Object({
  loggedOut: t.Boolean(),
});

export const tboxSessionSuccess = t.Object({
  authenticated: t.Literal(true),
  adminUser: tboxAuthAdminUser,
  restaurantAssignment: t.Optional(
    t.Object({
      restaurantId: t.String(),
    }),
  ),
});

export const authRoutes = new Elysia({ name: "auth-routes" })
  .use(astroBridgeDecorations)
  .post(
    "/auth/login",
    async ({ body, request, set, astroCookies, runtimeEnv }) => {
      const requestId = getOrCreateRequestId(request.headers);
      const controller = createAuthControllerFromRuntime({
        env: runtimeEnv,
        astroCookies,
        requestId,
      });
      const response = controller
        ? await controller.login(body)
        : authControllerUnavailable<{
            adminUser: typeof tboxAuthAdminUser.static;
            session: typeof tboxAuthSession.static;
          }>("login");

      set.status = response.status;
      return response.body as never;
    },
    {
      body: tboxLoginBody,
      response: {
        200: tboxApiSuccess<typeof tboxLoginSuccess>(tboxLoginSuccess),
        ...openApiErrorResponses([400, 401, 403, 500]),
      },
      detail: {
        summary: "Log in dashboard admin",
        description: "Authenticates a platform dashboard user and issues a secure session cookie.",
        tags: ["auth"],
      },
    },
  )
  .post(
    "/auth/logout",
    async ({ request, set, astroCookies, runtimeEnv }) => {
      const requestId = getOrCreateRequestId(request.headers);
      const controller = createAuthControllerFromRuntime({
        env: runtimeEnv,
        astroCookies,
        requestId,
      });
      const response = controller ? await controller.logout() : authControllerUnavailable();

      set.status = response.status;
      return response.body as never;
    },
    {
      response: {
        200: tboxApiSuccess<typeof tboxLogoutSuccess>(tboxLogoutSuccess),
        ...openApiErrorResponses([401, 500]),
      },
      detail: {
        summary: "Log out dashboard admin",
        description: "Revokes the active D1-backed session and clears the session cookie.",
        tags: ["auth"],
        security: [{ sessionCookie: [] }],
      },
    },
  )
  .get(
    "/auth/session",
    async ({ request, set, astroCookies, runtimeEnv }) => {
      const requestId = getOrCreateRequestId(request.headers);
      const controller = createAuthControllerFromRuntime({
        env: runtimeEnv,
        astroCookies,
        requestId,
      });
      const response = controller ? await controller.session() : authControllerUnavailable();

      set.status = response.status;
      return response.body as never;
    },
    {
      response: {
        200: tboxApiSuccess<typeof tboxSessionSuccess>(tboxSessionSuccess),
        ...openApiErrorResponses([401, 500]),
      },
      detail: {
        summary: "Resolve dashboard session",
        description: "Resolves the current dashboard session into server-side admin context.",
        tags: ["auth"],
        security: [{ sessionCookie: [] }],
      },
    },
  );

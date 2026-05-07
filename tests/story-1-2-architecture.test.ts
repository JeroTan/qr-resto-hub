import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function readText(path: string): string {
  return readFileSync(path, "utf8");
}

function expectPaths(paths: string[]): void {
  for (const path of paths) {
    expect(existsSync(path), `${path} should exist`).toBe(true);
  }
}

const featureAreas = [
  "customer-ordering",
  "restaurant-orders",
  "menu-management",
  "seating-qr",
  "subscriptions-ads",
  "platform-admin",
  "super-admin",
] as const;

const apiRouteAreas = [
  "auth",
  "platform-admin",
  "restaurant-admin",
  "menu",
  "seating-qr",
  "customer-ordering",
  "orders",
  "subscriptions-ads",
  "assets",
  "audit",
] as const;

describe("Story 1.2 source boundaries", () => {
  it("creates the required DDD, API, middleware, lib, utils, component, and fixture folders", () => {
    expectPaths([
      "src/domain/auth",
      "src/domain/tenants",
      "src/domain/menu",
      "src/domain/seating",
      "src/domain/orders",
      "src/domain/subscriptions",
      "src/domain/audit",
      "src/server/routes",
      "src/server/controllers",
      "src/server/services",
      "src/server/repositories",
      "src/server/db",
      "src/server/durable-objects",
      "src/server/openapi",
      "src/middleware",
      "src/components/ui",
      "src/components/layouts",
      "src/components/feedback",
      "src/components/navigation",
      "src/components/data-display",
      "src/lib/ads",
      "src/lib/cloudflare",
      "src/lib/paymongo",
      "src/lib/qr",
      "src/lib/r2",
      "src/utils",
      "src/test/fixtures",
    ]);

    for (const area of featureAreas) {
      expectPaths([
        `src/features/${area}/api`,
        `src/features/${area}/components`,
        `src/features/${area}/hooks`,
        `src/features/${area}/types`,
      ]);
    }
  });

  it("keeps Astro as the API transport bridge and delegates Elysia composition to src/server/app.ts", () => {
    const bridge = readText("src/pages/api/[...slug].ts");

    expect(bridge).toContain("export const prerender = false");
    expect(bridge).toContain("createApp");
    expect(bridge).not.toContain("new Elysia");
    expect(bridge).not.toContain("openapi(");
  });
});

describe("Story 1.2 API envelopes, route contracts, and OpenAPI metadata", () => {
  it("adapts internal results into standardized public success and error envelopes", async () => {
    const { apiSuccess, resultToApiResponse } = await import("../src/lib/api/response");
    const { forbiddenApiError, publicErrorMessage } = await import("../src/lib/api/errors");
    const { GeneralError } = await import("../src/utils/general/error");
    const { Result } = await import("../src/utils/general/result");

    expect(apiSuccess({ alive: true }, { code: "OK", requestId: "req_test" })).toEqual({
      data: { alive: true },
      meta: { code: "OK", requestId: "req_test" },
    });

    expect(resultToApiResponse(Result.okay({ id: "abc" }))).toEqual({
      data: { id: "abc" },
      meta: {},
    });

    expect(
      resultToApiResponse(
        Result.error(
          new GeneralError({ table: "sessions" }, "FORBIDDEN", "internal policy detail"),
        ),
      ),
    ).toEqual({
      error: {
        code: "FORBIDDEN",
        message: "You do not have permission to perform this action.",
      },
    });

    expect(forbiddenApiError()).toEqual({
      error: {
        code: "FORBIDDEN",
        message: "You do not have permission to perform this action.",
      },
    });
    expect(publicErrorMessage("INTERNAL_SERVER_ERROR", "database stack trace")).toBe(
      "An internal server error occurred.",
    );
  });

  it("keeps TypeBox as the route response schema source and quarantines Zod API response wrappers", async () => {
    const { openApiErrorResponses, tboxApiError, tboxApiResponse, tboxApiSuccess } =
      await import("../src/lib/typebox/api");
    const { t } = await import("elysia");
    const zodWrappers = readText("src/lib/zod/wrappers.ts");

    expect(tboxApiSuccess(t.Object({ ok: t.Boolean() }))).toMatchObject({ type: "object" });
    expect(tboxApiError()).toMatchObject({ type: "object" });
    expect(tboxApiResponse(t.Object({ ok: t.Boolean() }))).toMatchObject({
      anyOf: expect.any(Array),
    });
    expect(openApiErrorResponses([400, 403, 500])).toEqual({
      400: expect.any(Object),
      403: expect.any(Object),
      500: expect.any(Object),
    });
    expect(zodWrappers).not.toContain("zodApiResponse");
    expect(zodWrappers).not.toContain("zodPaginatedResponse");
  });

  it("composes Elysia route modules through controllers and exposes foundation metadata", async () => {
    const { createApp } = await import("../src/server/app");
    const app = createApp();

    const health = await app.handle(
      new Request("https://qr-resto-hub.test/api/foundation/health", {
        headers: { "x-request-id": "req_story_1_2" },
      }),
    );
    expect(health.status).toBe(200);
    await expect(health.json()).resolves.toEqual({
      data: {
        name: "qr-resto-hub",
        status: "ok",
      },
      meta: {
        code: "OK",
        requestId: "req_story_1_2",
      },
    });

    for (const area of apiRouteAreas) {
      const routeFile = `src/server/routes/${area}.routes.ts`;
      const routeText = readText(routeFile);
      expect(routeText).toContain("detail");
      expect(routeText).toContain("controller");
      expect(routeText).not.toMatch(/from ['"]@\/domain/);
      expect(routeText).not.toMatch(/from ['"]@\/server\/services/);
    }
  });
});

describe("Story 1.2 middleware, audit, logging, and UI foundations", () => {
  it("composes middleware in the required order and propagates request IDs", async () => {
    const { middlewareOrder } = await import("../src/middleware/index");
    const { REQUEST_ID_HEADER, getOrCreateRequestId } = await import("../src/utils/request-id");

    expect(middlewareOrder).toEqual([
      "request-id",
      "error-boundary",
      "auth-session",
      "tenant-context",
      "role-guard",
      "ad-entitlement",
    ]);
    expect(REQUEST_ID_HEADER).toBe("x-request-id");
    expect(getOrCreateRequestId(new Headers({ "x-request-id": "req_existing" }))).toBe(
      "req_existing",
    );
    expect(getOrCreateRequestId(new Headers())).toMatch(/^req_/);
  });

  it("defines audit writer and operational logging primitives without infrastructure dependencies", async () => {
    const auditModule = await import("../src/domain/audit");
    const loggerModule = await import("../src/server/services/operational-logger");

    expect(auditModule.AUDIT_EVENT_CATEGORIES).toEqual(
      expect.arrayContaining([
        "permission.denied",
        "auth.failure",
        "account.changed",
        "order.invalid_transition",
        "provider.failure",
        "qr.failure",
        "r2.failure",
        "live.reconnect_failure",
      ]),
    );
    expect(
      auditModule.createAuditEvent({
        category: "permission.denied",
        action: "route.blocked",
        actorId: "user_1",
      }),
    ).toMatchObject({
      category: "permission.denied",
      action: "route.blocked",
      actorId: "user_1",
    });

    expect(
      loggerModule.createOperationalLogEvent({
        category: "r2.failure",
        message: "Upload failed",
        tenantId: "tenant_1",
      }),
    ).toMatchObject({
      category: "r2.failure",
      message: "Upload failed",
      tenantId: "tenant_1",
    });
  });

  it("adds Tailwind v4 Modern Epicurean tokens and minimal shared primitives", () => {
    const css = readText("src/styles/global.css");

    expect(css).toContain("@theme");
    expect(css).toContain("--color-primary: #ff6b00");
    expect(css).toContain("--color-secondary: #5d2a18");
    expect(css).toContain("--color-tertiary: #8b8000");
    expect(css).toContain('--font-heading: "Plus Jakarta Sans"');
    expect(css).not.toContain("letter-spacing: -");
    expectPaths([
      "src/components/ui/Button.tsx",
      "src/components/ui/Badge.tsx",
      "src/components/ui/StatusBadge.tsx",
    ]);
  });
});

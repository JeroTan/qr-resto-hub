import { Elysia, t } from "elysia";
import { getFoundationHealth as controller } from "@/server/controllers/foundation.controller";
import { tboxApiSuccess, openApiErrorResponses } from "@/lib/typebox/api";
import { getOrCreateRequestId } from "@/utils/request-id";

export const tboxFoundationHealth = t.Object({
  name: t.Literal("qr-resto-hub"),
  status: t.Literal("ok"),
});

export const foundationRoutes = new Elysia({ name: "foundation-routes" }).get(
  "/foundation/health",
  ({ request }) => controller(getOrCreateRequestId(request.headers)),
  {
    response: {
      200: tboxApiSuccess<typeof tboxFoundationHealth>(tboxFoundationHealth),
      ...openApiErrorResponses([500]),
    },
    detail: {
      summary: "Foundation health check",
      description: "Reports API foundation availability and request ID propagation.",
      tags: ["foundation"],
    },
  },
);

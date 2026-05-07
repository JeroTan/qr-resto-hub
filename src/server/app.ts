import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import {
  assetsRoutes,
  auditRoutes,
  authRoutes,
  customerOrderingRoutes,
  foundationRoutes,
  menuRoutes,
  ordersRoutes,
  platformAdminRoutes,
  restaurantAdminRoutes,
  seatingQrRoutes,
  subscriptionsAdsRoutes,
} from "@/server/routes";

export function createApp() {
  return new Elysia({
    prefix: "/api",
    adapter: CloudflareAdapter,
    aot: false,
    normalize: true,
  })
    .use(
      openapi({
        documentation: {
          info: {
            title: "QR Resto Hub API",
            version: "1.0.0",
            description: "Internal API contract for QR Resto Hub.",
          },
        },
      }),
    )
    .use(foundationRoutes)
    .use(authRoutes)
    .use(platformAdminRoutes)
    .use(restaurantAdminRoutes)
    .use(menuRoutes)
    .use(seatingQrRoutes)
    .use(customerOrderingRoutes)
    .use(ordersRoutes)
    .use(subscriptionsAdsRoutes)
    .use(assetsRoutes)
    .use(auditRoutes);
}

export type App = ReturnType<typeof createApp>;

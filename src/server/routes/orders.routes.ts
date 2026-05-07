import { getFeatureRouteMetadata as controller } from "@/server/controllers/feature-metadata.controller";
import { createFeatureMetadataRoute } from "@/server/routes/feature-metadata-route";

export const ordersRoutes = createFeatureMetadataRoute({
  area: "orders",
  controller,
  detail: {
    summary: "Orders route metadata",
    description: "Foundation metadata endpoint for the orders route group.",
    tags: ["orders"],
  },
});

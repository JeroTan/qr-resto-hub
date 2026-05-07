import { getFeatureRouteMetadata as controller } from "@/server/controllers/feature-metadata.controller";
import { createFeatureMetadataRoute } from "@/server/routes/feature-metadata-route";

export const customerOrderingRoutes = createFeatureMetadataRoute({
  area: "customer-ordering",
  controller,
  detail: {
    summary: "Customer Ordering route metadata",
    description: "Foundation metadata endpoint for the customer-ordering route group.",
    tags: ["customer-ordering"],
  },
});

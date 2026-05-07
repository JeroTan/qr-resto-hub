import { getFeatureRouteMetadata as controller } from "@/server/controllers/feature-metadata.controller";
import { createFeatureMetadataRoute } from "@/server/routes/feature-metadata-route";

export const restaurantAdminRoutes = createFeatureMetadataRoute({
  area: "restaurant-admin",
  controller,
  detail: {
    summary: "Restaurant Admin route metadata",
    description: "Foundation metadata endpoint for the restaurant-admin route group.",
    tags: ["restaurant-admin"],
  },
});

import { getFeatureRouteMetadata as controller } from "@/server/controllers/feature-metadata.controller";
import { createFeatureMetadataRoute } from "@/server/routes/feature-metadata-route";

export const platformAdminRoutes = createFeatureMetadataRoute({
  area: "platform-admin",
  controller,
  detail: {
    summary: "Platform Admin route metadata",
    description: "Foundation metadata endpoint for the platform-admin route group.",
    tags: ["platform-admin"],
  },
});

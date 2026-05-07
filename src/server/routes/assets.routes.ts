import { getFeatureRouteMetadata as controller } from "@/server/controllers/feature-metadata.controller";
import { createFeatureMetadataRoute } from "@/server/routes/feature-metadata-route";

export const assetsRoutes = createFeatureMetadataRoute({
  area: "assets",
  controller,
  detail: {
    summary: "Assets route metadata",
    description: "Foundation metadata endpoint for the assets route group.",
    tags: ["assets"],
  },
});

import { getFeatureRouteMetadata as controller } from "@/server/controllers/feature-metadata.controller";
import { createFeatureMetadataRoute } from "@/server/routes/feature-metadata-route";

export const menuRoutes = createFeatureMetadataRoute({
  area: "menu",
  controller,
  detail: {
    summary: "Menu route metadata",
    description: "Foundation metadata endpoint for the menu route group.",
    tags: ["menu"],
  },
});

import { getFeatureRouteMetadata as controller } from "@/server/controllers/feature-metadata.controller";
import { createFeatureMetadataRoute } from "@/server/routes/feature-metadata-route";

export const authRoutes = createFeatureMetadataRoute({
  area: "auth",
  controller,
  detail: {
    summary: "Auth route metadata",
    description: "Foundation metadata endpoint for the auth route group.",
    tags: ["auth"],
  },
});

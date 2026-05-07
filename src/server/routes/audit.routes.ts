import { getFeatureRouteMetadata as controller } from "@/server/controllers/feature-metadata.controller";
import { createFeatureMetadataRoute } from "@/server/routes/feature-metadata-route";

export const auditRoutes = createFeatureMetadataRoute({
  area: "audit",
  controller,
  detail: {
    summary: "Audit route metadata",
    description: "Foundation metadata endpoint for the audit route group.",
    tags: ["audit"],
  },
});

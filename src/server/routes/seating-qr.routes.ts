import { getFeatureRouteMetadata as controller } from "@/server/controllers/feature-metadata.controller";
import { createFeatureMetadataRoute } from "@/server/routes/feature-metadata-route";

export const seatingQrRoutes = createFeatureMetadataRoute({
  area: "seating-qr",
  controller,
  detail: {
    summary: "Seating QR route metadata",
    description: "Foundation metadata endpoint for the seating-qr route group.",
    tags: ["seating-qr"],
  },
});

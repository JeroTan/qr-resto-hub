import { getFeatureRouteMetadata as controller } from "@/server/controllers/feature-metadata.controller";
import { createFeatureMetadataRoute } from "@/server/routes/feature-metadata-route";

export const subscriptionsAdsRoutes = createFeatureMetadataRoute({
  area: "subscriptions-ads",
  controller,
  detail: {
    summary: "Subscriptions Ads route metadata",
    description: "Foundation metadata endpoint for the subscriptions-ads route group.",
    tags: ["subscriptions-ads"],
  },
});

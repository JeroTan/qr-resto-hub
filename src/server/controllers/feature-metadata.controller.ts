import { apiSuccess, type ApiSuccess } from "@/lib/api/response";

export const API_ROUTE_AREAS = [
  "auth",
  "platform-admin",
  "restaurant-admin",
  "menu",
  "seating-qr",
  "customer-ordering",
  "orders",
  "subscriptions-ads",
  "assets",
  "audit",
] as const;

export type ApiRouteArea = (typeof API_ROUTE_AREAS)[number];

export type FeatureRouteMetadata = {
  area: ApiRouteArea;
  status: "foundation-ready";
  endpoints: string[];
};

export type FeatureMetadataController = (
  area: ApiRouteArea,
  requestId?: string,
) => ApiSuccess<FeatureRouteMetadata>;

export const getFeatureRouteMetadata: FeatureMetadataController = (area, requestId) =>
  apiSuccess(
    {
      area,
      status: "foundation-ready",
      endpoints: [`/api/${area}/_meta`],
    },
    {
      code: "OK",
      requestId,
    },
  );

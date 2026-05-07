import { Elysia, t } from "elysia";
import { tboxApiSuccess, openApiErrorResponses } from "@/lib/typebox/api";
import { getOrCreateRequestId } from "@/utils/request-id";
import type {
  ApiRouteArea,
  FeatureMetadataController,
  FeatureRouteMetadata,
} from "@/server/controllers/feature-metadata.controller";

export const tboxFeatureRouteMetadata = t.Object({
  area: t.String(),
  status: t.Literal("foundation-ready"),
  endpoints: t.Array(t.String()),
});

export type FeatureMetadataRouteOptions = {
  area: ApiRouteArea;
  controller: FeatureMetadataController;
  detail: {
    summary: string;
    description: string;
    tags: string[];
  };
};

export function createFeatureMetadataRoute({
  area,
  controller,
  detail,
}: FeatureMetadataRouteOptions) {
  return new Elysia({ name: `${area}-routes` }).get(
    `/${area}/_meta`,
    ({ request }) => controller(area, getOrCreateRequestId(request.headers)),
    {
      response: {
        200: tboxApiSuccess<typeof tboxFeatureRouteMetadata>(tboxFeatureRouteMetadata),
        ...openApiErrorResponses([500]),
      },
      detail,
    },
  );
}

export type { FeatureRouteMetadata };

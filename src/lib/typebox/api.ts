import { t } from "elysia";
import type { TSchema } from "@sinclair/typebox";
import { ERROR_CODE } from "@/utils/general/error";
import { SUCCESS_CODE } from "@/utils/general/success";

export const tboxErrorCode = t.Union(ERROR_CODE.map((code) => t.Literal(code)));
export const tboxSuccessCode = t.Union(SUCCESS_CODE.map((code) => t.Literal(code)));

export const tboxApiMeta = t.Object(
  {
    code: t.Optional(tboxSuccessCode),
    requestId: t.Optional(t.String()),
  },
  { additionalProperties: true },
);

export function tboxApiSuccess<TDataSchema extends TSchema>(dataSchema: TDataSchema) {
  return t.Object({
    data: dataSchema,
    meta: tboxApiMeta,
  });
}

export function tboxApiError<TDetailsSchema extends TSchema = ReturnType<typeof t.Unknown>>(
  detailsSchema: TDetailsSchema = t.Unknown() as TDetailsSchema,
) {
  return t.Object({
    error: t.Object({
      code: tboxErrorCode,
      message: t.String(),
      details: t.Optional(detailsSchema),
    }),
  });
}

export function tboxApiResponse<
  TDataSchema extends TSchema,
  TDetailsSchema extends TSchema = ReturnType<typeof t.Unknown>,
>(
  dataSchema: TDataSchema,
  detailsSchema?: TDetailsSchema,
) {
  return t.Union([tboxApiSuccess(dataSchema), tboxApiError(detailsSchema)]);
}

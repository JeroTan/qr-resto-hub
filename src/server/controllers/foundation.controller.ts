import { apiSuccess, type ApiSuccess } from "@/lib/api/response";

export type FoundationHealth = {
  name: "qr-resto-hub";
  status: "ok";
};

export function getFoundationHealth(requestId?: string): ApiSuccess<FoundationHealth> {
  return apiSuccess(
    {
      name: "qr-resto-hub",
      status: "ok",
    },
    {
      code: "OK",
      requestId,
    },
  );
}

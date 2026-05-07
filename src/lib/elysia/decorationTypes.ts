import type { AstroCookies } from "astro";
import Elysia from "elysia";

export type AstroBridgeDecorations = {
  urlData?: URL;
  astroCookies?: AstroCookies;
};

const astroBridgeDecorationsByRequest = new WeakMap<Request, AstroBridgeDecorations>();

export function bindAstroBridgeDecorations(
  request: Request,
  decorations: AstroBridgeDecorations,
): void {
  astroBridgeDecorationsByRequest.set(request, decorations);
}

export function clearAstroBridgeDecorations(request: Request): void {
  astroBridgeDecorationsByRequest.delete(request);
}

export function getAstroBridgeDecorations(request: Request): AstroBridgeDecorations {
  return astroBridgeDecorationsByRequest.get(request) ?? { urlData: new URL(request.url) };
}

export const astroBridgeDecorations = new Elysia({ name: "astro-bridge-decorations" }).derive(
  { as: "scoped" },
  ({ request }) => getAstroBridgeDecorations(request),
);

export const typedUrlData = new Elysia({ name: "typed-url-data" }).decorate(
  "urlData",
  undefined as URL | undefined,
);

export const typedAstroCookies = new Elysia({ name: "typed-astro-cookies" }).decorate(
  "astroCookies",
  undefined as AstroCookies | undefined,
);

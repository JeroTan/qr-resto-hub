import type { APIRoute } from "astro";
import { createApp } from "@/server/app";

export const prerender = false;

const app = createApp();

const handle: APIRoute = async (ctx) => {
  return await app
    .derive({ as: "scoped" }, () => ({
      urlData: ctx.url,
      astroCookies: ctx.cookies,
    }))
    .handle(ctx.request);
};

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
export const PATCH = handle;
export const HEAD = handle;
export const OPTIONS = handle;
export const TRACE = handle;
export const CONNECT = handle;
export const LINK = handle;
export const UNLINK = handle;

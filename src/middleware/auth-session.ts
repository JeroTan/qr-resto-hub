import type { MiddlewareHandler } from "astro";

export type AuthSessionLocals = {
  authSession?: {
    adminUserId: string;
    email: string;
    roleKey: "super_admin" | "platform_admin" | "restaurant_admin";
    status: "active" | "suspended";
    restaurantId?: string;
  };
};

export const authSessionMiddleware: MiddlewareHandler = (_context, next) => next();

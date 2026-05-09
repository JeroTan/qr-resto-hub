import { apiError, apiSuccess, type ApiResponse } from "@/lib/api/response";
import { errorCodeToHttpStatus } from "@/lib/api/errors";
import { parseAuthConfig } from "@/server/config/auth";
import { createDatabase } from "@/server/db/client";
import { D1AdminAuthRepository } from "@/server/repositories/admin-auth.repository";
import {
  createAuthService,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
  type AuthService,
  type LoginResult,
  type SessionContext,
} from "@/server/services/auth.service";
import type { ErrorCodeType } from "@/utils/general/error";

export type AstroCookieAdapter = {
  get?(name: string): { value: string } | undefined;
  set?(name: string, value: string, options: CookieOptions): void;
  delete?(name: string, options: CookieOptions): void;
};

export type CookieOptions = {
  httpOnly: true;
  secure: true;
  sameSite: "lax";
  path: "/";
  maxAge?: number;
  expires?: Date;
};

export type ControllerResponse<T> = {
  status: number;
  body: ApiResponse<T>;
};

export type AuthLoginBody = {
  email: string;
  password: string;
};

const genericAuthError = apiError("AUTHENTICATION", "Authentication failed.");
const genericSessionError = apiError("UNAUTHORIZED", "Authentication is required.");

function sessionCookieOptions(expiresAt: string): CookieOptions {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
    expires: new Date(expiresAt),
  };
}

function clearSessionCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  };
}

function errorResponse<T>(
  code: ErrorCodeType,
  fallback = genericSessionError,
): ControllerResponse<T> {
  return {
    status: errorCodeToHttpStatus(code),
    body: code === "AUTHENTICATION" ? genericAuthError : fallback,
  };
}

function sessionTokenFromCookie(astroCookies?: AstroCookieAdapter): string | undefined {
  return astroCookies?.get?.(SESSION_COOKIE_NAME)?.value;
}

function publicLoginResult(result: LoginResult) {
  return {
    adminUser: result.adminUser,
    session: result.session,
  };
}

export function createAuthController({
  service,
  astroCookies,
  requestId,
}: {
  service: AuthService;
  astroCookies?: AstroCookieAdapter;
  requestId?: string;
}) {
  return {
    async login(
      body: AuthLoginBody,
    ): Promise<ControllerResponse<ReturnType<typeof publicLoginResult>>> {
      const result = await service.login({ ...body, requestId });
      if (result.error !== null) {
        return errorResponse(result.error.code, genericAuthError);
      }

      astroCookies?.set?.(
        SESSION_COOKIE_NAME,
        result.content.sessionToken,
        sessionCookieOptions(result.content.session.expiresAt),
      );

      return {
        status: 200,
        body: apiSuccess(publicLoginResult(result.content), { code: "OK", requestId }),
      };
    },

    async logout(): Promise<ControllerResponse<{ loggedOut: true }>> {
      const result = await service.logout({
        sessionToken: sessionTokenFromCookie(astroCookies),
        requestId,
      });
      astroCookies?.delete?.(SESSION_COOKIE_NAME, clearSessionCookieOptions());

      if (result.error !== null) {
        return errorResponse(result.error.code);
      }

      return {
        status: 200,
        body: apiSuccess(result.content, { code: "OK", requestId }),
      };
    },

    async session(): Promise<ControllerResponse<{ authenticated: true } & SessionContext>> {
      const result = await service.resolveSession({
        sessionToken: sessionTokenFromCookie(astroCookies),
        requestId,
      });

      if (result.error !== null) {
        return errorResponse(result.error.code);
      }

      return {
        status: 200,
        body: apiSuccess(
          {
            authenticated: true,
            ...result.content,
          },
          { code: "OK", requestId },
        ),
      };
    },
  };
}

export function createAuthControllerFromRuntime({
  env,
  astroCookies,
  requestId,
}: {
  env?: Partial<Env> & Record<string, unknown>;
  astroCookies?: AstroCookieAdapter;
  requestId?: string;
}) {
  if (!env?.DB) {
    return null;
  }

  const config = parseAuthConfig(env);
  if (config.error !== null) {
    return null;
  }

  const repository = new D1AdminAuthRepository(createDatabase(env.DB));
  return createAuthController({
    service: createAuthService({ repository, config: config.content }),
    astroCookies,
    requestId,
  });
}

export function authControllerUnavailable<T>(
  kind: "login" | "session" = "session",
): ControllerResponse<T> {
  return {
    status: kind === "login" ? 401 : 500,
    body:
      kind === "login"
        ? genericAuthError
        : apiError("INTERNAL_SERVER_ERROR", "An internal server error occurred."),
  };
}

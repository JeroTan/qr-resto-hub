import { GeneralError } from "@/utils/general/error";
import { Result, type AppResult } from "@/utils/general/result";
import type { AdminRoleKey, AdminUserStatus } from "@/server/db/schema";
import type { AuthConfig } from "@/server/config/auth";
import { verifyPassword } from "@/lib/crypto/password";
import { generateSessionToken, hashSessionToken } from "@/lib/crypto/session-token";

export const SESSION_COOKIE_NAME = "qr_resto_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 8;

export type AdminAuthRecord = {
  id: string;
  email: string;
  roleId: string;
  roleKey: AdminRoleKey;
  status: AdminUserStatus;
  passwordHash: string;
  passwordSalt: string;
  isSuperAdminOwner: boolean;
  lastLoginAt?: string | null;
  restaurantId?: string | null;
};

export type SessionRecord = {
  id: string;
  adminUserId: string;
  sessionTokenHash: string;
  expiresAt: string;
  createdAt: string;
  revokedAt: string | null;
  lastSeenAt: string | null;
  adminUser: AdminAuthRecord;
  restaurantAssignment: { restaurantId: string } | null;
};

export type AuditReadyEvent = {
  category: string;
  action: string;
  actorAdminUserId?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
};

export type AdminAuthRepository = {
  ensureRoles(): Promise<void>;
  countActiveSuperAdminOwners(): Promise<number>;
  insertSuperAdminOwner(input: {
    id: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
  }): Promise<void>;
  findAdminByEmail(email: string): Promise<AdminAuthRecord | null>;
  insertSession(input: {
    id: string;
    adminUserId: string;
    sessionTokenHash: string;
    expiresAt: string;
    createdAt: string;
  }): Promise<void>;
  findSessionByTokenHash(sessionTokenHash: string): Promise<SessionRecord | null>;
  revokeSessionByTokenHash(sessionTokenHash: string, revokedAt: string): Promise<void>;
  updateAdminLastLogin(adminUserId: string, lastLoginAt: string): Promise<void>;
  updateSessionLastSeen(sessionId: string, lastSeenAt: string): Promise<void>;
  writeAuditEvent(input: AuditReadyEvent): Promise<void>;
};

export type LoginInput = {
  email: string;
  password: string;
  requestId?: string;
};

export type LoginResult = {
  adminUser: {
    id: string;
    email: string;
    roleKey: AdminRoleKey;
    status: AdminUserStatus;
  };
  session: {
    expiresAt: string;
  };
  sessionToken: string;
};

export type SessionContext = {
  adminUser: {
    id: string;
    email: string;
    roleKey: AdminRoleKey;
    status: AdminUserStatus;
  };
  restaurantAssignment?: {
    restaurantId: string;
  };
};

export type AuthService = ReturnType<typeof createAuthService>;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function authFailure(): AppResult<never> {
  return Result.error(new GeneralError({}, "AUTHENTICATION", "Authentication failed."));
}

function unauthorized(): AppResult<never> {
  return Result.error(new GeneralError({}, "UNAUTHORIZED", "Authentication is required."));
}

function toPublicAdminUser(adminUser: AdminAuthRecord) {
  return {
    id: adminUser.id,
    email: adminUser.email,
    roleKey: adminUser.roleKey,
    status: adminUser.status,
  };
}

async function safeAudit(repository: AdminAuthRepository, input: AuditReadyEvent): Promise<void> {
  try {
    await repository.writeAuditEvent(input);
  } catch {
    // Audit write failure must not leak auth internals or block generic auth failures.
  }
}

export function createAuthService({
  repository,
  config,
  now = () => new Date(),
  sessionDurationSeconds = SESSION_DURATION_SECONDS,
}: {
  repository: AdminAuthRepository;
  config: AuthConfig;
  now?: () => Date;
  sessionDurationSeconds?: number;
}) {
  return {
    async login(input: LoginInput): Promise<AppResult<LoginResult>> {
      const email = normalizeEmail(input.email);
      const adminUser = await repository.findAdminByEmail(email);

      if (!adminUser || adminUser.status !== "active") {
        await safeAudit(repository, {
          category: "auth.failure",
          action: "auth.login.failed",
          requestId: input.requestId,
          metadata: { reason: "invalid_credentials" },
        });
        return authFailure();
      }

      const passwordValid = await verifyPassword(
        input.password,
        config.passwordPepper,
        adminUser.passwordHash,
        adminUser.passwordSalt,
      );

      if (!passwordValid) {
        await safeAudit(repository, {
          category: "auth.failure",
          action: "auth.login.failed",
          requestId: input.requestId,
          metadata: { reason: "invalid_credentials" },
        });
        return authFailure();
      }

      const createdAt = now();
      const expiresAt = new Date(createdAt.getTime() + sessionDurationSeconds * 1000);
      const sessionToken = generateSessionToken();
      const sessionTokenHash = await hashSessionToken(sessionToken);

      await repository.insertSession({
        id: crypto.randomUUID(),
        adminUserId: adminUser.id,
        sessionTokenHash,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
      });
      await repository.updateAdminLastLogin(adminUser.id, createdAt.toISOString());
      await safeAudit(repository, {
        category: "account.changed",
        action: "auth.login.succeeded",
        actorAdminUserId: adminUser.id,
        requestId: input.requestId,
      });

      return Result.okay({
        adminUser: toPublicAdminUser(adminUser),
        session: { expiresAt: expiresAt.toISOString() },
        sessionToken,
      });
    },

    async logout({
      sessionToken,
      requestId,
    }: {
      sessionToken?: string;
      requestId?: string;
    }): Promise<AppResult<{ loggedOut: true }>> {
      if (sessionToken) {
        const sessionTokenHash = await hashSessionToken(sessionToken);
        const revokedAt = now().toISOString();
        await repository.revokeSessionByTokenHash(sessionTokenHash, revokedAt);
        await safeAudit(repository, {
          category: "account.changed",
          action: "auth.logout",
          requestId,
        });
      }

      return Result.okay({ loggedOut: true });
    },

    async resolveSession({
      sessionToken,
      requestId,
    }: {
      sessionToken?: string;
      requestId?: string;
    }): Promise<AppResult<SessionContext>> {
      if (!sessionToken) {
        return unauthorized();
      }

      const sessionTokenHash = await hashSessionToken(sessionToken);
      const session = await repository.findSessionByTokenHash(sessionTokenHash);
      const expiresAtMs = session ? new Date(session.expiresAt).getTime() : Number.NaN;
      const rejected =
        !session ||
        session.revokedAt !== null ||
        !Number.isFinite(expiresAtMs) ||
        expiresAtMs <= now().getTime() ||
        session.adminUser.status !== "active";

      if (rejected) {
        await safeAudit(repository, {
          category: "auth.failure",
          action: "auth.session.rejected",
          requestId,
          metadata: { reason: "invalid_session" },
        });
        return unauthorized();
      }

      await repository.updateSessionLastSeen(session.id, now().toISOString());

      return Result.okay({
        adminUser: toPublicAdminUser(session.adminUser),
        restaurantAssignment: session.restaurantAssignment ?? undefined,
      });
    },
  };
}

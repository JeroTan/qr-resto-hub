import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createAuthService, type AdminAuthRepository } from "../src/server/services/auth.service";
import { createSuperAdminSeedService } from "../src/server/services/super-admin-seed.service";
import { parseAuthConfig } from "../src/server/config/auth";
import { hashPassword, verifyPassword } from "../src/lib/crypto/password";
import { hashSessionToken } from "../src/lib/crypto/session-token";
import { createAuthController } from "../src/server/controllers/auth.controller";
import { jwtDecrypt, jwtEncrypt } from "../src/lib/crypto/jwt";

function readText(path: string): string {
  return readFileSync(path, "utf8");
}

const config = parseAuthConfig({
  SEED_SUPER_ADMIN_EMAIL: "owner@example.com",
  SEED_SUPER_ADMIN_PASSWORD: "Correct Horse Battery Staple 123!",
  AUTH_PASSWORD_PEPPER: "pepper-for-tests",
  JWT_SECRET: "jwt-secret-for-tests",
});

if (config.error !== null) {
  throw config.error;
}
const authConfig = config.content;

type StoredAdmin = Awaited<ReturnType<AdminAuthRepository["findAdminByEmail"]>>;
type StoredSession = NonNullable<
  Awaited<ReturnType<AdminAuthRepository["findSessionByTokenHash"]>>
>;

class FakeAuthRepository implements AdminAuthRepository {
  admins = new Map<string, NonNullable<StoredAdmin>>();
  sessions = new Map<string, StoredSession>();
  audits: Array<{ category: string; action: string; metadata?: Record<string, unknown> }> = [];
  duplicateOwnerRejected = false;

  async ensureRoles() {}

  async countActiveSuperAdminOwners() {
    return [...this.admins.values()].filter(
      (admin) =>
        admin.isSuperAdminOwner && admin.roleKey === "super_admin" && admin.status === "active",
    ).length;
  }

  async insertSuperAdminOwner(input: {
    id: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
  }) {
    if ((await this.countActiveSuperAdminOwners()) > 0) {
      this.duplicateOwnerRejected = true;
      throw new Error("UNIQUE constraint failed: admin_users.is_super_admin_owner");
    }

    this.admins.set(input.email, {
      id: input.id,
      email: input.email,
      roleId: "role_super_admin",
      roleKey: "super_admin",
      status: "active",
      passwordHash: input.passwordHash,
      passwordSalt: input.passwordSalt,
      isSuperAdminOwner: true,
      restaurantId: null,
    });
  }

  async findAdminByEmail(email: string) {
    return this.admins.get(email) ?? null;
  }

  async insertSession(input: {
    id: string;
    adminUserId: string;
    sessionTokenHash: string;
    expiresAt: string;
    createdAt: string;
  }) {
    const admin = [...this.admins.values()].find((candidate) => candidate.id === input.adminUserId);
    if (!admin) {
      throw new Error("admin missing");
    }

    this.sessions.set(input.sessionTokenHash, {
      ...input,
      revokedAt: null,
      lastSeenAt: null,
      adminUser: admin,
      restaurantAssignment: admin.restaurantId ? { restaurantId: admin.restaurantId } : null,
    });
  }

  async findSessionByTokenHash(sessionTokenHash: string) {
    return this.sessions.get(sessionTokenHash) ?? null;
  }

  async revokeSessionByTokenHash(sessionTokenHash: string, revokedAt: string) {
    const session = this.sessions.get(sessionTokenHash);
    if (session) {
      session.revokedAt = revokedAt;
    }
  }

  async updateAdminLastLogin(adminUserId: string, lastLoginAt: string) {
    for (const admin of this.admins.values()) {
      if (admin.id === adminUserId) {
        admin.lastLoginAt = lastLoginAt;
      }
    }
  }

  async updateSessionLastSeen(sessionId: string, lastSeenAt: string) {
    for (const session of this.sessions.values()) {
      if (session.id === sessionId) {
        session.lastSeenAt = lastSeenAt;
      }
    }
  }

  async writeAuditEvent(input: {
    category: string;
    action: string;
    metadata?: Record<string, unknown>;
  }) {
    this.audits.push(input);
  }
}

async function seededRepo() {
  const repository = new FakeAuthRepository();
  const seedService = createSuperAdminSeedService({
    repository,
    config: authConfig,
    passwordHashOptions: { iterations: 1_000 },
  });

  const seed = await seedService.seedSuperAdmin();
  expect(seed.error).toBeNull();
  return repository;
}

describe("Story 1.4 Super Admin seed and password hashing", () => {
  it("seeds exactly one active Super Admin owner and is idempotent", async () => {
    const repository = new FakeAuthRepository();
    const seedService = createSuperAdminSeedService({
      repository,
      config: authConfig,
      passwordHashOptions: { iterations: 1_000 },
    });

    await expect(seedService.seedSuperAdmin()).resolves.toMatchObject({
      content: { created: true },
      error: null,
    });
    await expect(seedService.seedSuperAdmin()).resolves.toMatchObject({
      content: { created: false },
      error: null,
    });

    expect(await repository.countActiveSuperAdminOwners()).toBe(1);
    expect(repository.audits.map((audit) => audit.action)).toEqual([
      "auth.seed_super_admin.created",
      "auth.seed_super_admin.skipped",
    ]);
  });

  it("rejects duplicate Super Admin owner creation through guard logic", async () => {
    const repository = await seededRepo();
    const owner = [...repository.admins.values()][0];

    await expect(
      repository.insertSuperAdminOwner({
        id: "second_owner",
        email: "other@example.com",
        passwordHash: owner.passwordHash,
        passwordSalt: owner.passwordSalt,
      }),
    ).rejects.toThrow("UNIQUE constraint failed");
    expect(repository.duplicateOwnerRejected).toBe(true);
  });

  it("adds local dev/prod seed commands that hash credentials and execute temp SQL through Wrangler", () => {
    const packageJson = JSON.parse(readText("package.json")) as {
      scripts: Record<string, string>;
    };
    const envExample = readText(".env.example");
    const seedScript = readText("scripts/seed-super-admin.mjs");
    const app = readText("src/server/app.ts");

    expect(packageJson.scripts["seed:super-admin:dev"]).toBe(
      "node scripts/seed-super-admin.mjs dev",
    );
    expect(packageJson.scripts["seed:super-admin:prod"]).toBe(
      "node scripts/seed-super-admin.mjs prod",
    );
    expect(envExample).not.toContain("SEED_ADMIN_RUN_SECRET");
    expect(envExample).not.toContain("SEED_SUPER_ADMIN_DEV_URL");
    expect(envExample).not.toContain("SEED_SUPER_ADMIN_PROD_URL");
    expect(seedScript).toContain("crypto.subtle.deriveBits");
    expect(seedScript).toContain("INSERT INTO admin_users");
    expect(seedScript).toContain("WHERE NOT EXISTS");
    expect(seedScript).toContain("wrangler");
    expect(seedScript).toContain("d1");
    expect(seedScript).toContain("execute");
    expect(seedScript).toContain("--file");
    expect(seedScript).toContain("rmSync(tempSqlPath");
    expect(app).not.toContain("internalSeedRoutes");
  });

  it("uses random per-user salt plus pepper and never stores raw password", async () => {
    const first = await hashPassword("same-password", "pepper", { iterations: 1_000 });
    const second = await hashPassword("same-password", "pepper", { iterations: 1_000 });

    expect(first.passwordSalt).not.toBe(second.passwordSalt);
    expect(first.passwordHash).not.toContain("same-password");
    expect(first.passwordHash).not.toContain("pepper");
    expect(first.passwordHash).toContain("pbkdf2-sha256");
    await expect(
      verifyPassword("same-password", "pepper", first.passwordHash, first.passwordSalt),
    ).resolves.toBe(true);
    await expect(
      verifyPassword("same-password", "wrong-pepper", first.passwordHash, first.passwordSalt),
    ).resolves.toBe(false);
  });
});

describe("Story 1.4 auth service and controller flow", () => {
  it("creates a hashed D1 session row and secure HttpOnly cookie for valid login", async () => {
    const repository = await seededRepo();
    const cookies: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];
    const service = createAuthService({ repository, config: authConfig });
    const controller = createAuthController({
      service,
      astroCookies: {
        set(name: string, value: string, options: Record<string, unknown>) {
          cookies.push({ name, value, options });
        },
      },
      requestId: "req_login",
    });

    const response = await controller.login({
      email: " Owner@Example.com ",
      password: "Correct Horse Battery Staple 123!",
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      data: {
        adminUser: {
          email: "owner@example.com",
          roleKey: "super_admin",
          status: "active",
        },
        session: { expiresAt: expect.any(String) },
      },
      meta: { code: "OK", requestId: "req_login" },
    });
    expect(cookies).toEqual([
      {
        name: "qr_resto_session",
        value: expect.any(String),
        options: expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
          maxAge: expect.any(Number),
          expires: expect.any(Date),
        }),
      },
    ]);
    expect([...repository.sessions.keys()]).not.toContain(cookies[0].value);
    await expect(hashSessionToken(cookies[0].value)).resolves.toBe(
      [...repository.sessions.keys()][0],
    );
  });

  it("returns generic invalid credential errors for unknown email, wrong password, suspended user, and missing config", async () => {
    const repository = await seededRepo();
    const owner = [...repository.admins.values()][0];
    repository.admins.set("suspended@example.com", {
      ...owner,
      id: "suspended",
      email: "suspended@example.com",
      status: "suspended",
    });

    const service = createAuthService({ repository, config: authConfig });

    for (const input of [
      { email: "missing@example.com", password: "whatever" },
      { email: "owner@example.com", password: "wrong" },
      { email: "suspended@example.com", password: "Correct Horse Battery Staple 123!" },
    ]) {
      const result = await service.login(input);
      expect(result.error?.code).toBe("AUTHENTICATION");
      expect(result.error?.message).toBe("Authentication failed.");
    }

    const badConfig = parseAuthConfig({});
    expect(badConfig.error?.code).toBe("AUTHENTICATION");
    expect(badConfig.error?.message).toBe("Authentication failed.");
  });

  it("resolves active sessions with role/status/restaurant context and rejects expired, revoked, and suspended sessions", async () => {
    const repository = await seededRepo();
    const service = createAuthService({ repository, config: authConfig });
    const login = await service.login({
      email: "owner@example.com",
      password: "Correct Horse Battery Staple 123!",
    });
    expect(login.error).toBeNull();
    if (login.error !== null) {
      throw login.error;
    }

    const resolved = await service.resolveSession({ sessionToken: login.content.sessionToken });
    expect(resolved.content).toMatchObject({
      adminUser: {
        id: expect.any(String),
        roleKey: "super_admin",
        status: "active",
      },
    });

    const hash = await hashSessionToken(login.content.sessionToken);
    repository.sessions.get(hash)!.expiresAt = "2000-01-01T00:00:00.000Z";
    expect(
      (await service.resolveSession({ sessionToken: login.content.sessionToken })).error?.code,
    ).toBe("UNAUTHORIZED");

    repository.sessions.get(hash)!.expiresAt = "2999-01-01T00:00:00.000Z";
    repository.sessions.get(hash)!.revokedAt = "2026-01-01T00:00:00.000Z";
    expect(
      (await service.resolveSession({ sessionToken: login.content.sessionToken })).error?.code,
    ).toBe("UNAUTHORIZED");

    repository.sessions.get(hash)!.revokedAt = null;
    repository.sessions.get(hash)!.adminUser.status = "suspended";
    expect(
      (await service.resolveSession({ sessionToken: login.content.sessionToken })).error?.code,
    ).toBe("UNAUTHORIZED");
  });

  it("rejects malformed session expiry instead of accepting corrupted D1 text", async () => {
    const repository = await seededRepo();
    const service = createAuthService({ repository, config: authConfig });
    const login = await service.login({
      email: "owner@example.com",
      password: "Correct Horse Battery Staple 123!",
    });
    expect(login.error).toBeNull();
    if (login.error !== null) {
      throw login.error;
    }

    const hash = await hashSessionToken(login.content.sessionToken);
    repository.sessions.get(hash)!.expiresAt = "not-a-date";

    expect(
      (await service.resolveSession({ sessionToken: login.content.sessionToken })).error?.code,
    ).toBe("UNAUTHORIZED");
  });

  it("resolves Super Admin, Platform Admin, and Restaurant Admin server-side session context", async () => {
    const repository = await seededRepo();
    const { passwordHash, passwordSalt } = await hashPassword(
      "Role Password 123!",
      "pepper-for-tests",
      {
        iterations: 1_000,
      },
    );
    repository.admins.set("platform@example.com", {
      id: "platform_admin_1",
      email: "platform@example.com",
      roleId: "role_platform_admin",
      roleKey: "platform_admin",
      status: "active",
      passwordHash,
      passwordSalt,
      isSuperAdminOwner: false,
      restaurantId: null,
    });
    repository.admins.set("restaurant@example.com", {
      id: "restaurant_admin_1",
      email: "restaurant@example.com",
      roleId: "role_restaurant_admin",
      roleKey: "restaurant_admin",
      status: "active",
      passwordHash,
      passwordSalt,
      isSuperAdminOwner: false,
      restaurantId: "restaurant_1",
    });

    const service = createAuthService({ repository, config: authConfig });

    for (const [email, password, roleKey, restaurantId] of [
      ["owner@example.com", "Correct Horse Battery Staple 123!", "super_admin", undefined],
      ["platform@example.com", "Role Password 123!", "platform_admin", undefined],
      ["restaurant@example.com", "Role Password 123!", "restaurant_admin", "restaurant_1"],
    ] as const) {
      const login = await service.login({ email, password });
      expect(login.error).toBeNull();
      if (login.error !== null) {
        throw login.error;
      }

      const resolved = await service.resolveSession({ sessionToken: login.content.sessionToken });
      expect(resolved.content).toMatchObject({
        adminUser: { roleKey, status: "active" },
        ...(restaurantId ? { restaurantAssignment: { restaurantId } } : {}),
      });
    }
  });

  it("logout revokes active session and clears matching cookie attributes", async () => {
    const repository = await seededRepo();
    const service = createAuthService({ repository, config: authConfig });
    const login = await service.login({
      email: "owner@example.com",
      password: "Correct Horse Battery Staple 123!",
    });
    expect(login.error).toBeNull();
    if (login.error !== null) {
      throw login.error;
    }

    const cookies: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];
    const controller = createAuthController({
      service,
      astroCookies: {
        get() {
          return { value: login.content.sessionToken };
        },
        delete(name: string, options: Record<string, unknown>) {
          cookies.push({ name, value: "", options });
        },
      },
      requestId: "req_logout",
    });

    const response = await controller.logout();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      data: { loggedOut: true },
      meta: { code: "OK", requestId: "req_logout" },
    });
    const stored = repository.sessions.get(await hashSessionToken(login.content.sessionToken));
    expect(stored?.revokedAt).toEqual(expect.any(String));
    expect(cookies).toEqual([
      {
        name: "qr_resto_session",
        value: "",
        options: expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
        }),
      },
    ]);
  });
});

describe("Story 1.4 route contracts and guardrails", () => {
  it("keeps JWT utilities on jose-compatible safe return shapes", async () => {
    const signed = await jwtEncrypt({
      payload: { sub: "admin_1" },
      secretKey: authConfig.jwtSecret,
      expiresInSeconds: 60,
    });

    expect(signed.error).toBeNull();
    if (signed.error !== null) {
      throw new Error(signed.error);
    }

    await expect(
      jwtDecrypt<{ sub: string }>({ token: signed.data, secretKey: authConfig.jwtSecret }),
    ).resolves.toMatchObject({
      data: { sub: "admin_1" },
      error: null,
    });
    await expect(
      jwtDecrypt<{ sub: string }>({ token: "not-a-token", secretKey: authConfig.jwtSecret }),
    ).resolves.toEqual({
      data: null,
      error: "Failed to verify JWT",
    });
  });

  it("uses TypeBox/Elysia schemas, OpenAPI metadata, and standardized envelopes on auth routes", () => {
    const route = readText("src/server/routes/auth.routes.ts");
    const bridge = readText("src/pages/api/[...slug].ts");

    expect(route).toContain('"/auth/login"');
    expect(route).toContain('"/auth/logout"');
    expect(route).toContain('"/auth/session"');
    expect(route).toContain("t.Object");
    expect(route).toContain("tboxApiSuccess");
    expect(route).toContain("openApiErrorResponses");
    expect(route).toContain('tags: ["auth"]');
    expect(route).toContain("summary");
    expect(route).toContain("description");
    expect(route).not.toMatch(/from ["']@\/domain/);
    expect(route).not.toMatch(/passwordHash|sessionTokenHash|createDatabase/);
    expect(bridge).toContain('from "cloudflare:workers"');
    expect(bridge).not.toContain("locals.runtime");
  });

  it("maps invalid auth route bodies to the standardized API error envelope", async () => {
    const { createApp } = await import("../src/server/app");
    const app = createApp();

    const response = await app.handle(
      new Request("https://qr-resto-hub.test/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-request-id": "req_validation",
        },
        body: JSON.stringify({ email: "x" }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "VALIDATION",
        message: "The request contains invalid data.",
      },
    });
  });

  it("keeps auth implementation free of leaked seed secrets and Node-only auth libraries", () => {
    const source = [
      "src/lib/crypto/password.ts",
      "src/lib/crypto/jwt.ts",
      "src/server/config/auth.ts",
      "src/server/services/auth.service.ts",
      "src/server/services/super-admin-seed.service.ts",
      "src/server/controllers/auth.controller.ts",
      "src/server/routes/auth.routes.ts",
    ]
      .map(readText)
      .join("\n");

    expect(source).not.toMatch(/bcrypt|argon2|jsonwebtoken|node:crypto|from ["']crypto["']/);
    expect(source).not.toContain("Correct Horse Battery Staple");
    expect(source).not.toContain("pepper-for-tests");
    expect(source).not.toMatch(/PAYMONGO|PayMongo/);
  });
});

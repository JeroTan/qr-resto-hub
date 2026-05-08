import { and, eq, isNull, sql } from "drizzle-orm";
import type { AppDatabase } from "@/server/db/client";
import {
  adminSessions,
  adminUsers,
  auditEvents,
  restaurantAdminAssignments,
  roles,
} from "@/server/db/schema";
import type {
  AdminAuthRecord,
  AdminAuthRepository,
  AuditReadyEvent,
  SessionRecord,
} from "@/server/services/auth.service";

const ROLE_ROWS = [
  { id: "role_super_admin", key: "super_admin", label: "Super Admin" },
  { id: "role_platform_admin", key: "platform_admin", label: "Platform Admin" },
  { id: "role_restaurant_admin", key: "restaurant_admin", label: "Restaurant Admin" },
] satisfies Array<{ id: string; key: AdminAuthRecord["roleKey"]; label: string }>;

function toAdminRecord(row: {
  id: string;
  email: string;
  roleId: string;
  roleKey: AdminAuthRecord["roleKey"];
  status: AdminAuthRecord["status"];
  passwordHash: string;
  passwordSalt: string;
  isSuperAdminOwner: boolean;
  restaurantId: string | null;
}): AdminAuthRecord {
  return {
    id: row.id,
    email: row.email,
    roleId: row.roleId,
    roleKey: row.roleKey,
    status: row.status,
    passwordHash: row.passwordHash,
    passwordSalt: row.passwordSalt,
    isSuperAdminOwner: row.isSuperAdminOwner,
    restaurantId: row.restaurantId,
  };
}

export class D1AdminAuthRepository implements AdminAuthRepository {
  constructor(private readonly db: AppDatabase) {}

  async ensureRoles(): Promise<void> {
    await this.db.insert(roles).values(ROLE_ROWS).onConflictDoNothing();
  }

  async countActiveSuperAdminOwners(): Promise<number> {
    const [row] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(adminUsers)
      .where(
        and(
          eq(adminUsers.isSuperAdminOwner, true),
          eq(adminUsers.roleId, "role_super_admin"),
          eq(adminUsers.status, "active"),
        ),
      );

    return Number(row?.count ?? 0);
  }

  async insertSuperAdminOwner(input: {
    id: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
  }): Promise<void> {
    await this.db.insert(adminUsers).values({
      id: input.id,
      email: input.email,
      roleId: "role_super_admin",
      status: "active",
      passwordHash: input.passwordHash,
      passwordSalt: input.passwordSalt,
      isSuperAdminOwner: true,
    });
  }

  async findAdminByEmail(email: string): Promise<AdminAuthRecord | null> {
    const [row] = await this.db
      .select({
        id: adminUsers.id,
        email: adminUsers.email,
        roleId: adminUsers.roleId,
        roleKey: roles.key,
        status: adminUsers.status,
        passwordHash: adminUsers.passwordHash,
        passwordSalt: adminUsers.passwordSalt,
        isSuperAdminOwner: adminUsers.isSuperAdminOwner,
        restaurantId: restaurantAdminAssignments.restaurantId,
      })
      .from(adminUsers)
      .innerJoin(roles, eq(adminUsers.roleId, roles.id))
      .leftJoin(
        restaurantAdminAssignments,
        eq(adminUsers.id, restaurantAdminAssignments.adminUserId),
      )
      .where(eq(adminUsers.email, email))
      .limit(1);

    return row ? toAdminRecord(row) : null;
  }

  async insertSession(input: {
    id: string;
    adminUserId: string;
    sessionTokenHash: string;
    expiresAt: string;
    createdAt: string;
  }): Promise<void> {
    await this.db.insert(adminSessions).values({
      id: input.id,
      adminUserId: input.adminUserId,
      sessionTokenHash: input.sessionTokenHash,
      expiresAt: input.expiresAt,
      createdAt: input.createdAt,
    });
  }

  async findSessionByTokenHash(sessionTokenHash: string): Promise<SessionRecord | null> {
    const [row] = await this.db
      .select({
        sessionId: adminSessions.id,
        adminUserId: adminSessions.adminUserId,
        sessionTokenHash: adminSessions.sessionTokenHash,
        expiresAt: adminSessions.expiresAt,
        createdAt: adminSessions.createdAt,
        revokedAt: adminSessions.revokedAt,
        lastSeenAt: adminSessions.lastSeenAt,
        id: adminUsers.id,
        email: adminUsers.email,
        roleId: adminUsers.roleId,
        roleKey: roles.key,
        status: adminUsers.status,
        passwordHash: adminUsers.passwordHash,
        passwordSalt: adminUsers.passwordSalt,
        isSuperAdminOwner: adminUsers.isSuperAdminOwner,
        restaurantId: restaurantAdminAssignments.restaurantId,
      })
      .from(adminSessions)
      .innerJoin(adminUsers, eq(adminSessions.adminUserId, adminUsers.id))
      .innerJoin(roles, eq(adminUsers.roleId, roles.id))
      .leftJoin(
        restaurantAdminAssignments,
        eq(adminUsers.id, restaurantAdminAssignments.adminUserId),
      )
      .where(eq(adminSessions.sessionTokenHash, sessionTokenHash))
      .limit(1);

    if (!row) {
      return null;
    }

    const adminUser = toAdminRecord({
      id: row.id,
      email: row.email,
      roleId: row.roleId,
      roleKey: row.roleKey,
      status: row.status,
      passwordHash: row.passwordHash,
      passwordSalt: row.passwordSalt,
      isSuperAdminOwner: row.isSuperAdminOwner,
      restaurantId: row.restaurantId,
    });

    return {
      id: row.sessionId,
      adminUserId: row.adminUserId,
      sessionTokenHash: row.sessionTokenHash,
      expiresAt: row.expiresAt,
      createdAt: row.createdAt,
      revokedAt: row.revokedAt,
      lastSeenAt: row.lastSeenAt,
      adminUser,
      restaurantAssignment: row.restaurantId ? { restaurantId: row.restaurantId } : null,
    };
  }

  async revokeSessionByTokenHash(sessionTokenHash: string, revokedAt: string): Promise<void> {
    await this.db
      .update(adminSessions)
      .set({ revokedAt })
      .where(
        and(eq(adminSessions.sessionTokenHash, sessionTokenHash), isNull(adminSessions.revokedAt)),
      );
  }

  async updateAdminLastLogin(adminUserId: string, lastLoginAt: string): Promise<void> {
    await this.db
      .update(adminUsers)
      .set({ lastLoginAt, updatedAt: lastLoginAt })
      .where(eq(adminUsers.id, adminUserId));
  }

  async updateSessionLastSeen(sessionId: string, lastSeenAt: string): Promise<void> {
    await this.db.update(adminSessions).set({ lastSeenAt }).where(eq(adminSessions.id, sessionId));
  }

  async writeAuditEvent(input: AuditReadyEvent): Promise<void> {
    await this.db.insert(auditEvents).values({
      id: crypto.randomUUID(),
      category: input.category,
      action: input.action,
      actorAdminUserId: input.actorAdminUserId,
      requestId: input.requestId,
      metadataJson: input.metadata,
    });
  }
}

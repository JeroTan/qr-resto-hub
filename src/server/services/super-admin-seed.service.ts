import { GeneralError } from "@/utils/general/error";
import { Result, type AppResult } from "@/utils/general/result";
import type { AuthConfig } from "@/server/config/auth";
import type { AdminAuthRepository } from "@/server/services/auth.service";
import { hashPassword, type PasswordHashOptions } from "@/lib/crypto/password";

export type SuperAdminSeedResult = {
  created: boolean;
  adminUserId?: string;
};

export function createSuperAdminSeedService({
  repository,
  config,
  passwordHashOptions,
}: {
  repository: AdminAuthRepository;
  config: AuthConfig;
  passwordHashOptions?: PasswordHashOptions;
}) {
  return {
    async seedSuperAdmin(): Promise<AppResult<SuperAdminSeedResult>> {
      await repository.ensureRoles();

      const existingOwners = await repository.countActiveSuperAdminOwners();
      if (existingOwners > 0) {
        await repository.writeAuditEvent({
          category: "account.changed",
          action: "auth.seed_super_admin.skipped",
          metadata: { reason: "owner_exists" },
        });
        return Result.okay({ created: false });
      }

      const adminUserId = crypto.randomUUID();
      const { passwordHash, passwordSalt } = await hashPassword(
        config.seedSuperAdminPassword,
        config.passwordPepper,
        passwordHashOptions,
      );

      try {
        await repository.insertSuperAdminOwner({
          id: adminUserId,
          email: config.seedSuperAdminEmail,
          passwordHash,
          passwordSalt,
        });
      } catch {
        return Result.error(
          new GeneralError({}, "CONFLICT", "The request conflicts with the current state."),
        );
      }

      await repository.writeAuditEvent({
        category: "account.changed",
        action: "auth.seed_super_admin.created",
        actorAdminUserId: adminUserId,
      });

      return Result.okay({ created: true, adminUserId });
    },
  };
}

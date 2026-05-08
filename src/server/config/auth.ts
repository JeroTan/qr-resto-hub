import { z } from "zod";
import { GeneralError } from "@/utils/general/error";
import { Result, type AppResult } from "@/utils/general/result";

export type AuthConfig = {
  seedSuperAdminEmail: string;
  seedSuperAdminPassword: string;
  passwordPepper: string;
  jwtSecret: string;
};

const authConfigSchema = z.object({
  SEED_SUPER_ADMIN_EMAIL: z.email().transform((email) => email.trim().toLowerCase()),
  SEED_SUPER_ADMIN_PASSWORD: z.string().min(12),
  AUTH_PASSWORD_PEPPER: z.string().min(16),
  JWT_SECRET: z.string().min(16),
});

export function parseAuthConfig(input: Record<string, unknown>): AppResult<AuthConfig> {
  const parsed = authConfigSchema.safeParse(input);

  if (!parsed.success) {
    return Result.error(new GeneralError({}, "AUTHENTICATION", "Authentication failed."));
  }

  return Result.okay({
    seedSuperAdminEmail: parsed.data.SEED_SUPER_ADMIN_EMAIL,
    seedSuperAdminPassword: parsed.data.SEED_SUPER_ADMIN_PASSWORD,
    passwordPepper: parsed.data.AUTH_PASSWORD_PEPPER,
    jwtSecret: parsed.data.JWT_SECRET,
  });
}

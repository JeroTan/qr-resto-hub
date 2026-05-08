/**
 * Seed script for Super Admin
 * Run with: npx wrangler d1 execute qr-resto-hub-dev --local -e dev -c wrangler.jsonc --file=src/server/db/seed.sql
 * Or for remote: npx wrangler d1 execute qr-resto-hub-dev --remote -e dev -c wrangler.jsonc --command="INSERT INTO..."
 */

import { drizzle } from 'drizzle-orm/d1';
import { admins } from './schema';
import { hash } from '../../lib/crypto/hash';
import { eq } from 'drizzle-orm';

interface Env {
  DB: D1Database;
  SEED_SUPER_ADMIN_EMAIL?: string;
  SEED_SUPER_ADMIN_PASSWORD?: string;
  AUTH_PASSWORD_PEPPER?: string;
}

export async function seedSuperAdmin(env: Env): Promise<{ success: boolean; message: string }> {
  const email = env.SEED_SUPER_ADMIN_EMAIL;
  const password = env.SEED_SUPER_ADMIN_PASSWORD;
  const pepper = env.AUTH_PASSWORD_PEPPER || '';

  if (!email || !password) {
    return {
      success: false,
      message: 'SEED_SUPER_ADMIN_EMAIL and SEED_SUPER_ADMIN_PASSWORD environment variables are required',
    };
  }

  const db = drizzle(env.DB);

  // Check if super admin already exists
  const existingSuperAdmin = await db
    .select()
    .from(admins)
    .where(eq(admins.role, 'super_admin'))
    .limit(1);

  if (existingSuperAdmin.length > 0) {
    return {
      success: false,
      message: 'Super Admin already exists. Only one Super Admin is allowed.',
    };
  }

  // Hash password with optional pepper
  const passwordWithPepper = pepper ? `${password}${pepper}` : password;
  const passwordHash = await hash(passwordWithPepper);

  // Create Super Admin
  const now = Date.now();
  const superAdminId = crypto.randomUUID();

  await db.insert(admins).values({
    id: superAdminId,
    email,
    password_hash: passwordHash,
    role: 'super_admin',
    is_active: true,
    created_at: new Date(now),
    updated_at: new Date(now),
  });

  return {
    success: true,
    message: `Super Admin created with email: ${email}`,
  };
}

// For direct SQL execution via wrangler
export const SEED_SQL = `
-- This SQL seed template creates a super admin
-- Replace :email and :password_hash with actual values
-- Use hash() function from src/lib/crypto/hash.ts to generate password hash

INSERT INTO admins (id, email, password_hash, role, is_active, created_at, updated_at)
VALUES (
  :id,
  :email,
  :password_hash,
  'super_admin',
  1,
  :created_at,
  :updated_at
);
`;

/**
 * Generate the SQL for seeding a super admin (for use with wrangler d1 execute)
 */
export function generateSeedSQL(email: string, passwordHash: string): string {
  const now = Math.floor(Date.now() / 1000);
  const id = crypto.randomUUID();

  return `INSERT INTO admins (id, email, password_hash, role, is_active, created_at, updated_at)
VALUES ('${id}', '${email}', '${passwordHash}', 'super_admin', 1, ${now}, ${now});`;
}
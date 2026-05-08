import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const target = process.argv[2];
const validTargets = new Set(["dev", "prod"]);
const databaseNames = {
  dev: "qr-resto-hub-dev",
  prod: "qr-resto-hub-prod",
};
const PASSWORD_ALGORITHM = "pbkdf2-sha256";
const DEFAULT_ITERATIONS = 99_999; // Cloudflare Worker maximum iterations is 100,000, but we leave some headroom for future increases without breaking existing hashes
const DEFAULT_SALT_BYTES = 16;
const HASH_BYTES = 32;

function loadDotEnv(path = ".env") {
  if (!existsSync(path)) {
    return;
  }

  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts
      .join("=")
      .trim()
      .replace(/^["']|["']$/g, "");
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

if (!validTargets.has(target)) {
  console.error("Usage: node scripts/seed-super-admin.mjs <dev|prod>");
  process.exit(1);
}

loadDotEnv();

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}.`);
  }
  return value;
}

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex) {
  if (hex.length % 2 !== 0 || /[^0-9a-f]/i.test(hex)) {
    throw new Error("Invalid hex");
  }

  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

function toArrayBuffer(bytes) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

function randomHex(byteLength) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

async function hashPassword(password, pepper) {
  const passwordSalt = randomHex(DEFAULT_SALT_BYTES);
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(`${pepper}\u0000${password}`),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: toArrayBuffer(hexToBytes(passwordSalt)),
      iterations: DEFAULT_ITERATIONS,
    },
    material,
    HASH_BYTES * 8,
  );
  const digest = bytesToHex(new Uint8Array(bits));

  return {
    passwordHash: `${PASSWORD_ALGORITHM}$${DEFAULT_ITERATIONS}$${digest}`,
    passwordSalt,
  };
}

function sqlString(value) {
  return `'${value.replaceAll("'", "''")}'`;
}

function createSeedSql({ adminUserId, email, passwordHash, passwordSalt }) {
  return `INSERT INTO roles (id, key, label)
VALUES
  ('role_super_admin', 'super_admin', 'Super Admin'),
  ('role_platform_admin', 'platform_admin', 'Platform Admin'),
  ('role_restaurant_admin', 'restaurant_admin', 'Restaurant Admin')
ON CONFLICT(id) DO NOTHING;

INSERT INTO admin_users (
  id,
  email,
  role_id,
  status,
  password_hash,
  password_salt,
  is_super_admin_owner
)
SELECT
  ${sqlString(adminUserId)},
  ${sqlString(email)},
  'role_super_admin',
  'active',
  ${sqlString(passwordHash)},
  ${sqlString(passwordSalt)},
  1
WHERE NOT EXISTS (
  SELECT 1
  FROM admin_users
  WHERE is_super_admin_owner = 1
    AND role_id = 'role_super_admin'
    AND status = 'active'
);
`;
}

let email;
let password;
let pepper;
try {
  email = requiredEnv("SEED_SUPER_ADMIN_EMAIL").toLowerCase();
  password = requiredEnv("SEED_SUPER_ADMIN_PASSWORD");
  pepper = requiredEnv("AUTH_PASSWORD_PEPPER");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const adminUserId = crypto.randomUUID();
const { passwordHash, passwordSalt } = await hashPassword(password, pepper);
const sql = createSeedSql({ adminUserId, email, passwordHash, passwordSalt });
const tempDir = ".tmp";
const tempSqlPath = join(tempDir, `seed-super-admin-${target}-${Date.now()}.sql`);
const wranglerCommand =
  process.platform === "win32"
    ? {
        file: "cmd.exe",
        args: ["/c", "npx", "wrangler"],
      }
    : {
        file: "npx",
        args: ["wrangler"],
      };

mkdirSync(tempDir, { recursive: true });

try {
  writeFileSync(tempSqlPath, sql, "utf8");
  execFileSync(
    wranglerCommand.file,
    [
      ...wranglerCommand.args,
      "d1",
      "execute",
      databaseNames[target],
      "--env",
      target,
      "--remote",
      "--file",
      tempSqlPath,
    ],
    { stdio: "inherit" },
  );

  console.log(
    `Super Admin seed SQL applied to ${databaseNames[target]}. If an active owner already existed, insert was skipped.`,
  );
} finally {
  rmSync(tempSqlPath, { force: true });
}

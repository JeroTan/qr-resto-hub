CREATE TABLE `admin_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`admin_user_id` text NOT NULL,
	`session_token_hash` text NOT NULL,
	`expires_at` text NOT NULL,
	`revoked_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`last_seen_at` text,
	FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_admin_sessions_admin_user_id` ON `admin_sessions` (`admin_user_id`);--> statement-breakpoint
CREATE INDEX `idx_admin_sessions_expires_at` ON `admin_sessions` (`expires_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_admin_sessions_session_token_hash` ON `admin_sessions` (`session_token_hash`);--> statement-breakpoint
CREATE TABLE `admin_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`role_id` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`password_hash` text NOT NULL,
	`password_salt` text NOT NULL,
	`is_super_admin_owner` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`suspended_at` text,
	`last_login_at` text,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE cascade ON DELETE restrict,
	CONSTRAINT "ck_admin_users_super_admin_owner_role" CHECK("admin_users"."is_super_admin_owner" = 0 OR "admin_users"."role_id" = 'role_super_admin')
);
--> statement-breakpoint
CREATE INDEX `idx_admin_users_role_id` ON `admin_users` (`role_id`);--> statement-breakpoint
CREATE INDEX `idx_admin_users_status` ON `admin_users` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_admin_users_email` ON `admin_users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_admin_users_id_role_id` ON `admin_users` (`id`,`role_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_admin_users_super_admin_owner` ON `admin_users` (`is_super_admin_owner`) WHERE "admin_users"."is_super_admin_owner" = 1;--> statement-breakpoint
CREATE TABLE `audit_events` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`action` text NOT NULL,
	`actor_admin_user_id` text,
	`restaurant_id` text,
	`target_type` text,
	`target_id` text,
	`request_id` text,
	`metadata_json` text,
	`occurred_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`actor_admin_user_id`) REFERENCES `admin_users`(`id`) ON UPDATE cascade ON DELETE set null,
	FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_audit_events_category` ON `audit_events` (`category`);--> statement-breakpoint
CREATE INDEX `idx_audit_events_actor_admin_user_id` ON `audit_events` (`actor_admin_user_id`);--> statement-breakpoint
CREATE INDEX `idx_audit_events_restaurant_id` ON `audit_events` (`restaurant_id`);--> statement-breakpoint
CREATE INDEX `idx_audit_events_occurred_at` ON `audit_events` (`occurred_at`);--> statement-breakpoint
CREATE TABLE `restaurant_admin_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`admin_user_id` text NOT NULL,
	`restaurant_id` text NOT NULL,
	`admin_user_role_id` text DEFAULT 'role_restaurant_admin' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`admin_user_id`,`admin_user_role_id`) REFERENCES `admin_users`(`id`,`role_id`) ON UPDATE cascade ON DELETE cascade,
	CONSTRAINT "ck_restaurant_admin_assignments_role" CHECK("restaurant_admin_assignments"."admin_user_role_id" = 'role_restaurant_admin')
);
--> statement-breakpoint
CREATE INDEX `idx_restaurant_admin_assignments_admin_user_id` ON `restaurant_admin_assignments` (`admin_user_id`);--> statement-breakpoint
CREATE INDEX `idx_restaurant_admin_assignments_admin_user_role_id` ON `restaurant_admin_assignments` (`admin_user_role_id`);--> statement-breakpoint
CREATE INDEX `idx_restaurant_admin_assignments_restaurant_id` ON `restaurant_admin_assignments` (`restaurant_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_restaurant_admin_assignments_admin_user_id` ON `restaurant_admin_assignments` (`admin_user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_restaurant_admin_assignments_restaurant_id` ON `restaurant_admin_assignments` (`restaurant_id`);--> statement-breakpoint
CREATE TABLE `restaurants` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`status` text DEFAULT 'pending_setup' NOT NULL,
	`payment_stage_enabled` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_restaurants_status` ON `restaurants` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_restaurants_slug` ON `restaurants` (`slug`);--> statement-breakpoint
CREATE TABLE `roles` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`label` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_roles_key` ON `roles` (`key`);--> statement-breakpoint
INSERT INTO `roles` (`id`, `key`, `label`) VALUES
	('role_super_admin', 'super_admin', 'Super Admin'),
	('role_platform_admin', 'platform_admin', 'Platform Admin'),
	('role_restaurant_admin', 'restaurant_admin', 'Restaurant Admin');
--> statement-breakpoint
CREATE TABLE `tenant_entitlements` (
	`id` text PRIMARY KEY NOT NULL,
	`restaurant_id` text NOT NULL,
	`plan_key` text DEFAULT 'free' NOT NULL,
	`ad_policy` text DEFAULT 'ads_required' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`current_period_ends_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_tenant_entitlements_restaurant_id` ON `tenant_entitlements` (`restaurant_id`);--> statement-breakpoint
CREATE INDEX `idx_tenant_entitlements_status` ON `tenant_entitlements` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_tenant_entitlements_restaurant_id` ON `tenant_entitlements` (`restaurant_id`);

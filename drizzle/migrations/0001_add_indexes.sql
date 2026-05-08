-- Add missing indexes for query performance
CREATE INDEX IF NOT EXISTS `idx_admins_role` ON `admins` (`role`);
CREATE INDEX IF NOT EXISTS `idx_admins_restaurant_id` ON `admins` (`restaurant_id`);
CREATE INDEX IF NOT EXISTS `idx_audit_events_event_type` ON `audit_events` (`event_type`);
CREATE INDEX IF NOT EXISTS `idx_audit_events_created_at` ON `audit_events` (`created_at`);
CREATE INDEX IF NOT EXISTS `idx_audit_events_actor_id` ON `audit_events` (`actor_id`);
CREATE INDEX IF NOT EXISTS `idx_sessions_admin_id` ON `sessions` (`admin_id`);
CREATE INDEX IF NOT EXISTS `idx_restaurants_slug` ON `restaurants` (`slug`);
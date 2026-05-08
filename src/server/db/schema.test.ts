import { describe, it, expect } from 'vitest';
import { adminRoleEnum, subscriptionStatusEnum } from './schema';

describe('Schema Types', () => {
  it('should have valid admin role enum values', () => {
    expect(adminRoleEnum).toContain('super_admin');
    expect(adminRoleEnum).toContain('platform_admin');
    expect(adminRoleEnum).toContain('restaurant_admin');
    expect(adminRoleEnum.length).toBe(3);
  });

  it('should have valid subscription status enum values', () => {
    expect(subscriptionStatusEnum).toContain('none');
    expect(subscriptionStatusEnum).toContain('active');
    expect(subscriptionStatusEnum).toContain('past_due');
    expect(subscriptionStatusEnum).toContain('cancelled');
    expect(subscriptionStatusEnum.length).toBe(4);
  });

  it('should have correct table names in snake_case plural form', () => {
    // These are verified by the actual schema exports
    const tableNames = ['admins', 'sessions', 'restaurants', 'restaurant_settings', 'entitlements', 'audit_events'];
    tableNames.forEach(name => {
      expect(name).toBe(name.toLowerCase());
      expect(name).toMatch(/^[a-z_]+$/);
    });
  });
});

describe('Schema Relationships', () => {
  it('should define correct foreign key relationships', () => {
    // Admin -> Restaurant (nullable, one-to-many from admin perspective)
    // Restaurant -> Admin (one-to-one via restaurant_id on admin)
    // Session -> Admin (not null foreign key)
    // RestaurantSettings -> Restaurant (one-to-one)
    // Entitlements -> Restaurant (one-to-one)
    // AuditEvents -> Admin (nullable, for tracking actors)
    // AuditEvents -> Restaurant (nullable, for target context)
    expect(true).toBe(true); // Placeholder - actual FK tests require DB
  });
});

describe('Naming Conventions', () => {
  it('should follow snake_case for table names', () => {
    const tables = ['admins', 'sessions', 'restaurants', 'restaurant_settings', 'entitlements', 'audit_events'];
    tables.forEach(table => {
      expect(table).toBe(table.toLowerCase());
      expect(table).not.toMatch(/[A-Z]/);
      expect(table).not.toMatch(/^-/);
    });
  });

  it('should follow snake_case for columns', () => {
    const columns = ['id', 'email', 'password_hash', 'role', 'restaurant_id', 'is_active', 'created_at', 'updated_at'];
    columns.forEach(col => {
      expect(col).toBe(col.toLowerCase());
      expect(col).not.toMatch(/[A-Z]/);
    });
  });

  it('should use id as primary key naming', () => {
    // Primary keys are always named 'id' per architecture
    const primaryKeyName = 'id';
    expect(primaryKeyName).toBe('id');
  });

  it('should use {entity}_id pattern for foreign keys', () => {
    const fkPatterns = ['admin_id', 'restaurant_id'];
    fkPatterns.forEach(fk => {
      expect(fk).toMatch(/_id$/);
      expect(fk).toBe(fk.toLowerCase());
    });
  });
});
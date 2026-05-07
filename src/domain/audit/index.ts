export const AUDIT_EVENT_CATEGORIES = [
  "permission.denied",
  "auth.failure",
  "account.changed",
  "order.invalid_transition",
  "provider.failure",
  "qr.failure",
  "r2.failure",
  "live.reconnect_failure",
] as const;

export type AuditEventCategory = (typeof AUDIT_EVENT_CATEGORIES)[number];

export type AuditEventContext = {
  tenantId?: string;
  restaurantId?: string;
  orderId?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
};

export type AuditEventInput = AuditEventContext & {
  category: AuditEventCategory;
  action: string;
  actorId?: string;
  occurredAt?: string;
};

export type AuditEvent = Required<Pick<AuditEventInput, "category" | "action" | "occurredAt">> &
  Omit<AuditEventInput, "occurredAt">;

export type AuditEventWriter = {
  write(event: AuditEvent): Promise<void>;
};

export function createAuditEvent(input: AuditEventInput): AuditEvent {
  return {
    ...input,
    occurredAt: input.occurredAt ?? new Date().toISOString(),
  };
}

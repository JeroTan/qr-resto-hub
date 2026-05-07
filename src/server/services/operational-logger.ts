import type { AuditEventCategory } from "@/domain/audit";

export type OperationalLogLevel = "info" | "warn" | "error";

export type OperationalLogEvent = {
  category: AuditEventCategory;
  message: string;
  level: OperationalLogLevel;
  occurredAt: string;
  tenantId?: string;
  restaurantId?: string;
  orderId?: string;
  requestId?: string;
  context?: Record<string, unknown>;
};

export type OperationalLogger = {
  log(event: OperationalLogEvent): Promise<void>;
};

export type OperationalLogEventInput = Omit<OperationalLogEvent, "level" | "occurredAt"> & {
  level?: OperationalLogLevel;
  occurredAt?: string;
};

export function createOperationalLogEvent(input: OperationalLogEventInput): OperationalLogEvent {
  return {
    ...input,
    level: input.level ?? "error",
    occurredAt: input.occurredAt ?? new Date().toISOString(),
  };
}

export const noopOperationalLogger: OperationalLogger = {
  async log() {},
};

import { Badge } from "./Badge";

export type StatusBadgeStatus =
  | "pending"
  | "preparing"
  | "to-serve"
  | "payment"
  | "completed"
  | "cancelled";

export type StatusBadgeProps = {
  status: StatusBadgeStatus;
};

const statusLabels: Record<StatusBadgeStatus, string> = {
  pending: "Pending",
  preparing: "Preparing",
  "to-serve": "To Serve",
  payment: "Payment",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusClasses: Record<StatusBadgeStatus, string> = {
  pending: "bg-board-pending text-board-pending-strong",
  preparing: "bg-board-preparing text-board-preparing-strong",
  "to-serve": "bg-board-serve text-board-serve-strong",
  payment: "bg-board-payment text-board-payment-strong",
  completed: "bg-board-completed text-board-completed-strong",
  cancelled: "bg-danger-soft text-danger-strong",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge className={statusClasses[status]}>{statusLabels[status]}</Badge>;
}

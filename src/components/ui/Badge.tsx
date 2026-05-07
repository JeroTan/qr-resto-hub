import type { HTMLAttributes, ReactNode } from "react";

export type BadgeTone = "neutral" | "primary" | "success" | "danger";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: BadgeTone;
};

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-neutral-100 text-neutral-700",
  primary: "bg-primary-container text-primary-dark",
  success: "bg-success-soft text-success-strong",
  danger: "bg-danger-soft text-danger-strong",
};

export function Badge({ children, className = "", tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex min-h-6 items-center rounded-sm px-2 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}

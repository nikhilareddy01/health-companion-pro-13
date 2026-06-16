import type { HTMLAttributes, ReactNode } from "react";

export function Card({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      {...props}
      className={`rounded-3xl bg-card p-5 shadow-[var(--shadow-card)] ${className}`}
    >
      {children}
    </div>
  );
}

export function StatChip({
  icon,
  label,
  value,
  tone = "primary",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: "primary" | "secondary" | "warning" | "success";
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary-soft text-primary",
    secondary: "bg-secondary-soft text-secondary",
    warning: "bg-[oklch(0.96_0.05_75)] text-[oklch(0.55_0.12_75)]",
    success: "bg-[oklch(0.95_0.05_155)] text-success",
  };
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-[var(--shadow-soft)]">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>
        {icon}
      </div>
      <div>
        <div className="text-[11px] font-medium text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold text-foreground">{value}</div>
      </div>
    </div>
  );
}

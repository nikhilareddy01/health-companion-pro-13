import type { ButtonHTMLAttributes, ReactNode } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function PrimaryButton({
  variant = "primary",
  size = "lg",
  className = "",
  children,
  ...props
}: PrimaryButtonProps) {
  const variants: Record<string, string> = {
    primary:
      "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-float)] hover:opacity-95",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    ghost: "bg-primary-soft text-primary hover:bg-primary-soft/70",
    outline: "border border-border bg-background text-foreground hover:bg-muted",
    destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
  };
  const sizes: Record<string, string> = {
    sm: "h-10 px-4 text-sm rounded-xl",
    md: "h-12 px-5 text-sm rounded-2xl",
    lg: "h-14 px-6 text-base rounded-2xl",
  };
  return (
    <button
      {...props}
      className={`inline-flex w-full items-center justify-center gap-2 font-semibold transition active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

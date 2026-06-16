import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

interface AppHeaderProps {
  title?: string;
  back?: boolean;
  right?: ReactNode;
  transparent?: boolean;
}

export function AppHeader({ title, back = true, right, transparent }: AppHeaderProps) {
  const router = useRouter();
  return (
    <div
      className={`flex items-center justify-between px-5 py-3 ${
        transparent ? "" : "bg-background"
      }`}
    >
      <div className="w-10">
        {back && (
          <button
            onClick={() => router.history.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground transition active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
      </div>
      {title && (
        <h1 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h1>
      )}
      <div className="flex w-10 items-center justify-end">{right}</div>
    </div>
  );
}

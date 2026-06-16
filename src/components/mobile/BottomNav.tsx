import { Link, useLocation } from "@tanstack/react-router";
import { Home, Apple, Pill, TrendingUp, User } from "lucide-react";

const items = [
  { to: "/dashboard", label: "Home", Icon: Home },
  { to: "/diet", label: "Diet", Icon: Apple },
  { to: "/medicine-overview", label: "Medicine", Icon: Pill },
  { to: "/progress", label: "Progress", Icon: TrendingUp },
  { to: "/profile", label: "Profile", Icon: User },
] as const;

export function BottomNav() {
  const location = useLocation();
  return (
    <nav className="sticky bottom-0 z-30 mt-auto border-t border-border bg-background/95 backdrop-blur-xl">
      <div className="grid grid-cols-5 gap-1 px-2 pb-4 pt-2">
        {items.map(({ to, label, Icon }) => {
          const active = location.pathname === to || location.pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className="group flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition"
            >
              <div
                className={`flex h-8 w-12 items-center justify-center rounded-full transition ${
                  active ? "bg-primary-soft text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "stroke-[2.2]" : ""}`} />
              </div>
              <span
                className={`text-[10px] font-medium ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

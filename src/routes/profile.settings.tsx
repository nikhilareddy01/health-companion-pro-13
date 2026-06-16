import { createFileRoute, Link } from "@tanstack/react-router";
import { User, Globe, Shield, HelpCircle, Info, ChevronRight } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";

export const Route = createFileRoute("/profile/settings")({ component: Page });

const rows = [
  { to: "/profile/account", Icon: User, t: "Account Settings" },
  { to: "/profile/language", Icon: Globe, t: "Language" },
  { to: "/profile/privacy", Icon: Shield, t: "Privacy Policy" },
  { to: "/profile/help", Icon: HelpCircle, t: "Help & Support" },
  { to: "/profile/about", Icon: Info, t: "About App" },
];

function Page() {
  return (
    <Screen title="Settings" contentClass="px-5 pb-8">
      <div className="space-y-2">{rows.map((r) => (
        <Link key={r.to} to={r.to} className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><r.Icon className="h-5 w-5" /></div>
          <p className="flex-1 text-sm font-semibold text-foreground">{r.t}</p>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      ))}</div>
    </Screen>
  );
}

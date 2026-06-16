import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Footprints, Moon, Droplet, Pill } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";

export const Route = createFileRoute("/daily-summary")({ component: Page });

function Page() {
  return (
    <Screen title="Daily Summary" contentClass="px-5 pb-8">
      <div className="rounded-3xl p-5 text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
        <p className="text-xs opacity-90">Yesterday · May 10</p>
        <p className="mt-1 text-2xl font-bold">Great day! 🌿</p>
        <p className="mt-2 text-sm opacity-90">You hit 4 of 5 goals and stayed within target glucose range.</p>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Cell Icon={Heart} label="Avg heart rate" value="74 bpm" />
        <Cell Icon={Footprints} label="Steps" value="8,210" />
        <Cell Icon={Moon} label="Sleep" value="7h 12m" />
        <Cell Icon={Droplet} label="Water" value="2.3 L" />
      </div>
      <Link to="/medicine/history" className="mt-4 flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
        <Pill className="h-5 w-5 text-primary" />
        <div className="flex-1"><p className="text-sm font-semibold text-foreground">Medication adherence</p><p className="text-xs text-muted-foreground">3/3 doses taken</p></div>
        <span className="text-sm font-bold text-success">100%</span>
      </Link>
    </Screen>
  );
}

function Cell({ Icon, label, value }: { Icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-2 text-[11px] text-muted-foreground">{label}</p>
      <p className="text-base font-bold text-foreground">{value}</p>
    </div>
  );
}

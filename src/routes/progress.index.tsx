import { createFileRoute, Link } from "@tanstack/react-router";
import { Stethoscope, Activity, Smile, Moon, TrendingUp } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";

export const Route = createFileRoute("/progress/")({ component: Page });

function Page() {
  return (
    <Screen noHeader bottomNav contentClass="px-5 pb-6">
      <div className="pt-4">
        <p className="text-xs text-muted-foreground">Health monitoring</p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Your progress</h1>
      </div>

      <div className="mt-5 rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-success" /><p className="text-sm font-semibold text-foreground">Weekly trend</p></div>
        <div className="mt-4 flex h-32 items-end justify-between gap-2">
          {[40, 55, 48, 70, 62, 80, 75].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-xl" style={{ height: `${h}%`, background: "var(--gradient-primary)" }} />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
        </div>
      </div>

      <h2 className="mt-6 text-sm font-semibold text-foreground">Trackers</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <T to="/progress/symptoms" Icon={Stethoscope} t="Symptoms" />
        <T to="/progress/pain" Icon={Activity} t="Pain level" />
        <T to="/progress/mood" Icon={Smile} t="Mood" />
        <T to="/progress/sleep" Icon={Moon} t="Sleep" />
      </div>
    </Screen>
  );
}

function T({ to, Icon, t }: { to: string; Icon: any; t: string }) {
  return (
    <Link to={to} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon className="h-5 w-5" /></div>
      <p className="mt-3 text-sm font-semibold text-foreground">{t}</p>
    </Link>
  );
}

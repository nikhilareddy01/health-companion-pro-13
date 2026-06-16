import { createFileRoute } from "@tanstack/react-router";
import { Moon } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";

export const Route = createFileRoute("/progress/sleep")({ component: Page });

function Page() {
  return (
    <Screen title="Sleep Tracking" contentClass="px-5 pb-8">
      <div className="rounded-3xl p-6 text-primary-foreground shadow-[var(--shadow-float)]" style={{ background: "linear-gradient(135deg, oklch(0.5 0.13 270), oklch(0.4 0.13 290))" }}>
        <Moon className="h-7 w-7" />
        <p className="mt-3 text-xs opacity-90">LAST NIGHT</p>
        <p className="text-3xl font-bold">7h 12m</p>
        <p className="mt-1 text-sm opacity-90">Deep 1h 40m · REM 1h 50m</p>
      </div>
      <h2 className="mt-6 text-sm font-semibold text-foreground">This week</h2>
      <div className="mt-3 flex h-32 items-end justify-between gap-2">
        {[6.2, 7.5, 7.0, 6.8, 8.0, 7.2, 7.5].map((h, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div className="w-full rounded-t-xl bg-secondary" style={{ height: `${(h / 9) * 100}%` }} />
            <span className="text-[10px] text-muted-foreground">{h}h</span>
          </div>
        ))}
      </div>
    </Screen>
  );
}

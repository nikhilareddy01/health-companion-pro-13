import { createFileRoute } from "@tanstack/react-router";
import { Pill, Activity, Heart } from "lucide-react";
import { useState } from "react";
import { Screen } from "@/components/mobile/Screen";

export const Route = createFileRoute("/calendar")({ component: Page });

const days = ["S", "M", "T", "W", "T", "F", "S"];

function Page() {
  const [day, setDay] = useState(11);
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <Screen title="Health Calendar" contentClass="px-5 pb-8">
      <div className="rounded-3xl bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-foreground">May 2026</p>
          <div className="flex gap-2 text-xs font-medium text-primary">Today</div>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] text-muted-foreground">
          {days.map((d, i) => <div key={i} className="py-1">{d}</div>)}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1.5">
          {dates.map((d) => (
            <button key={d} onClick={() => setDay(d)} className={`flex aspect-square items-center justify-center rounded-xl text-xs font-semibold transition ${d === day ? "bg-primary text-primary-foreground shadow-[var(--shadow-float)]" : [4, 7, 11, 15, 20].includes(d) ? "bg-primary-soft text-primary" : "text-foreground"}`}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm font-semibold text-foreground">Events on day {day}</p>
      <div className="mt-3 space-y-2">
        {[{ Icon: Pill, t: "Metformin 500mg", s: "8:00 AM" }, { Icon: Activity, t: "Cardio · 30 min", s: "6:30 PM" }, { Icon: Heart, t: "BP check-in", s: "9:00 PM" }].map((e, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><e.Icon className="h-5 w-5" /></div>
            <div className="flex-1"><p className="text-sm font-semibold text-foreground">{e.t}</p><p className="text-xs text-muted-foreground">{e.s}</p></div>
          </div>
        ))}
      </div>
    </Screen>
  );
}

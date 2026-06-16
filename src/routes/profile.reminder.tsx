import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sun, Sunset, Droplet, Apple, CheckCircle2 } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";

export const Route = createFileRoute("/profile/reminder")({ component: Page });

const init = [
  { k: "Morning Medicine", time: "08:00", on: true, Icon: Sun },
  { k: "Evening Medicine", time: "21:00", on: true, Icon: Sunset },
  { k: "Water Reminder", time: "10:00", on: false, Icon: Droplet },
  { k: "Diet Reminder", time: "13:00", on: true, Icon: Apple },
];

function Page() {
  const [list, setList] = useState(init);
  const [saved, setSaved] = useState(false);
  const update = (i: number, patch: Partial<typeof init[number]>) => setList((p) => p.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  return (
    <Screen title="Reminders" contentClass="px-5 pb-8">
      <div className="space-y-3">{list.map((r, i) => (
        <div key={r.k} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><r.Icon className="h-5 w-5" /></div>
            <p className="flex-1 text-sm font-semibold text-foreground">{r.k}</p>
            <button onClick={() => update(i, { on: !r.on })} className={`h-7 w-12 rounded-full p-0.5 transition ${r.on ? "bg-primary" : "bg-muted"}`}>
              <div className={`h-6 w-6 rounded-full bg-white shadow transition ${r.on ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <input type="time" value={r.time} onChange={(e) => update(i, { time: e.target.value })} className="mt-3 h-10 w-full rounded-xl bg-muted px-3 text-sm outline-none" />
        </div>
      ))}</div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <PrimaryButton variant="outline" onClick={() => setList(init)}>Reset</PrimaryButton>
        <PrimaryButton onClick={() => setSaved(true)}>Save Changes</PrimaryButton>
      </div>
      {saved && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-success/15 p-4 text-success">
          <CheckCircle2 className="h-5 w-5" />
          <p className="text-sm font-semibold">Changes saved successfully</p>
        </div>
      )}
    </Screen>
  );
}

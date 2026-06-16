import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";

export const Route = createFileRoute("/medicine/history")({ component: Page });

const days = [
  { date: "Today · May 11", items: [{ n: "Metformin 8 AM", taken: true }, { n: "Vitamin D3 1 PM", taken: true }, { n: "Atorvastatin 9 PM", taken: false }] },
  { date: "May 10", items: [{ n: "Metformin 8 AM", taken: true }, { n: "Vitamin D3 1 PM", taken: true }, { n: "Atorvastatin 9 PM", taken: true }] },
  { date: "May 9", items: [{ n: "Metformin 8 AM", taken: true }, { n: "Vitamin D3 1 PM", taken: false }, { n: "Atorvastatin 9 PM", taken: true }] },
];

function Page() {
  return (
    <Screen title="Medicine History" contentClass="px-5 pb-8">
      <div className="grid grid-cols-3 gap-3">
        <Tile label="Adherence" value="92%" />
        <Tile label="Streak" value="14d" />
        <Tile label="Missed" value="3" />
      </div>
      <div className="mt-5 space-y-5">
        {days.map((d) => (
          <div key={d.date}>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">{d.date}</p>
            <div className="space-y-2">
              {d.items.map((it, i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
                  <p className="text-sm font-medium text-foreground">{it.n}</p>
                  {it.taken ? <CheckCircle2 className="h-5 w-5 text-success" /> : <XCircle className="h-5 w-5 text-destructive" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-card p-4 text-center shadow-[var(--shadow-soft)]"><p className="text-xl font-bold text-foreground">{value}</p><p className="text-[11px] text-muted-foreground">{label}</p></div>;
}

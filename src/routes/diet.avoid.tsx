import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/mobile/Screen";
import { Ban } from "lucide-react";

export const Route = createFileRoute("/diet/avoid")({ component: Page });

const groups = [
  { c: "Diabetes Type 2", items: ["Sugary drinks", "White bread", "Fried snacks", "Sweet desserts"] },
  { c: "Hypertension", items: ["High-sodium chips", "Processed meats", "Canned soups", "Pickles"] },
];

function Page() {
  return (
    <Screen title="Foods to Avoid" contentClass="px-5 pb-8">
      <p className="text-sm text-muted-foreground">Based on your selected conditions.</p>
      <div className="mt-5 space-y-5">{groups.map((g) => (
        <div key={g.c}>
          <p className="text-xs font-semibold text-muted-foreground">{g.c.toUpperCase()}</p>
          <div className="mt-2 space-y-2">
            {g.items.map((it) => (
              <div key={it} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/15 text-destructive"><Ban className="h-4 w-4" /></div>
                <p className="text-sm font-medium text-foreground">{it}</p>
              </div>
            ))}
          </div>
        </div>
      ))}</div>
    </Screen>
  );
}

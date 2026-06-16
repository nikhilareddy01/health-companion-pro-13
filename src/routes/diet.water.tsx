import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Droplet, Plus, Minus } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";

export const Route = createFileRoute("/diet/water")({ component: Page });

function Page() {
  const [glasses, setGlasses] = useState(6);
  const target = 10;
  return (
    <Screen title="Water Intake" contentClass="px-5 pb-8">
      <div className="rounded-3xl bg-secondary-soft p-6 text-center">
        <Droplet className="mx-auto h-12 w-12 text-secondary" fill="currentColor" />
        <p className="mt-4 text-4xl font-bold text-foreground">{(glasses * 0.25).toFixed(1)} L</p>
        <p className="text-sm text-muted-foreground">of {target * 0.25} L target</p>
      </div>
      <div className="mt-6 flex items-center justify-center gap-6">
        <button onClick={() => setGlasses((g) => Math.max(0, g - 1))} className="flex h-14 w-14 items-center justify-center rounded-full bg-muted"><Minus /></button>
        <p className="text-xl font-bold">{glasses} glasses</p>
        <button onClick={() => setGlasses((g) => Math.min(20, g + 1))} className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground"><Plus /></button>
      </div>
      <div className="mt-7 grid grid-cols-5 gap-2">
        {Array.from({ length: target }).map((_, i) => (
          <div key={i} className={`flex aspect-square items-center justify-center rounded-2xl ${i < glasses ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>
            <Droplet className="h-5 w-5" fill={i < glasses ? "currentColor" : "none"} />
          </div>
        ))}
      </div>
    </Screen>
  );
}

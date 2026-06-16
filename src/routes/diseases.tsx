import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";

export const Route = createFileRoute("/diseases")({ component: Page });

const list = ["Diabetes Type 2", "Hypertension", "Migraine", "Asthma", "PCOS", "Thyroid", "High Cholesterol", "Acidity / GERD", "Arthritis", "Anxiety"];

function Page() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(["Diabetes Type 2", "Hypertension"]);
  const toggle = (d: string) => setSelected((s) => (s.includes(d) ? s.filter((x) => x !== d) : [...s, d]));
  return (
    <Screen title="My Conditions" contentClass="px-5 pb-8">
      <p className="text-sm text-muted-foreground">Select the conditions you're managing. We'll tailor your plan accordingly.</p>
      <div className="mt-5 space-y-2.5">
        {list.map((d) => {
          const on = selected.includes(d);
          return (
            <button key={d} onClick={() => toggle(d)} className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${on ? "border-primary bg-primary-soft" : "border-border bg-card"}`}>
              <span className={`text-sm font-medium ${on ? "text-primary" : "text-foreground"}`}>{d}</span>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full ${on ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {on && <Check className="h-3.5 w-3.5" />}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-8">
        <PrimaryButton onClick={() => navigate({ to: "/ai-recommendation" })}>Continue</PrimaryButton>
      </div>
    </Screen>
  );
}

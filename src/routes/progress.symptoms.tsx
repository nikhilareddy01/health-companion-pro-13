import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { toast } from "sonner";

export const Route = createFileRoute("/progress/symptoms")({ component: Page });

const symptoms = ["Headache", "Fatigue", "Dizziness", "Nausea", "Chest tightness", "Joint pain"];

function Page() {
  const [sel, setSel] = useState<string[]>([]);
  const toggle = (s: string) => setSel((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  return (
    <Screen title="Symptom Tracker" contentClass="px-5 pb-8">
      <p className="text-sm text-muted-foreground">What are you experiencing today?</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {symptoms.map((s) => (
          <button key={s} onClick={() => toggle(s)} className={`rounded-full px-4 py-2 text-xs font-medium transition ${sel.includes(s) ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{s}</button>
        ))}
      </div>
      <div className="mt-8"><PrimaryButton onClick={() => toast.success("Symptoms logged")}>Log Symptoms</PrimaryButton></div>
    </Screen>
  );
}

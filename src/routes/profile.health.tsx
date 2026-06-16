import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { Edit3 } from "lucide-react";

export const Route = createFileRoute("/profile/health")({ component: Page });

const items = [
  ["Blood Pressure", "120 / 80 mmHg"],
  ["Blood Sugar", "98 mg/dL"],
  ["Heart Rate", "72 bpm"],
  ["Pain Level", "2 / 10"],
  ["Age", "34 years"],
  ["Weight", "68 kg"],
  ["Height", "172 cm"],
  ["BMI", "23.0 — Healthy"],
];

function Page() {
  return (
    <Screen title="Health Details" headerRight={<button className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"><Edit3 className="h-4 w-4" /></button>} contentClass="px-5 pb-8">
      <div className="space-y-2">{items.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <p className="text-sm text-muted-foreground">{k}</p>
          <p className="text-sm font-semibold text-foreground">{v}</p>
        </div>
      ))}</div>
      <div className="mt-5 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
        <p className="text-xs font-medium text-muted-foreground">MEDICAL NOTES</p>
        <p className="mt-2 text-sm leading-relaxed text-foreground">Type 2 diabetes since 2022. Mild hypertension. Family history of cardiac disease. No known drug allergies.</p>
      </div>
      <div className="mt-8"><PrimaryButton>Edit Details</PrimaryButton></div>
    </Screen>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sun, Check, X } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";

export const Route = createFileRoute("/medicine/morning")({ component: Page });

function Page() {
  const navigate = useNavigate();
  return (
    <Screen noHeader bgClass="bg-background" contentClass="px-6 pb-10 pt-2">
      <div className="rounded-3xl p-6 text-center text-primary-foreground shadow-[var(--shadow-float)]" style={{ background: "var(--gradient-primary)" }}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
          <Sun className="h-7 w-7" />
        </div>
        <p className="text-xs opacity-90">MORNING REMINDER · 8:00 AM</p>
        <p className="mt-3 text-3xl font-bold">Metformin</p>
        <p className="mt-1 text-sm opacity-90">500mg · 1 tablet after breakfast</p>
      </div>
      <div className="mt-6 space-y-3 rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]">
        <Info label="Type" value="Tablet" />
        <Info label="With food" value="Yes — after breakfast" />
        <Info label="Note" value="Helps regulate blood sugar." />
      </div>
      <div className="mt-7 grid grid-cols-2 gap-3">
        <PrimaryButton variant="outline" onClick={() => navigate({ to: "/medicine/missed" })}><X className="h-4 w-4" /> Skip</PrimaryButton>
        <PrimaryButton onClick={() => navigate({ to: "/medicine/taken" })}><Check className="h-4 w-4" /> Taken</PrimaryButton>
      </div>
    </Screen>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-3 text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium text-foreground">{value}</span></div>;
}

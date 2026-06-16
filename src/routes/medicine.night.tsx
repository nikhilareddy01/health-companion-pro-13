import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Moon, Check, X } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";

export const Route = createFileRoute("/medicine/night")({ component: Page });

function Page() {
  const navigate = useNavigate();
  return (
    <Screen noHeader bgClass="bg-background" contentClass="px-6 pb-10 pt-2">
      <div className="rounded-3xl p-6 text-center text-primary-foreground shadow-[var(--shadow-float)]" style={{ background: "linear-gradient(135deg, oklch(0.55 0.12 250), oklch(0.45 0.13 280))" }}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
          <Moon className="h-7 w-7" />
        </div>
        <p className="text-xs opacity-90">NIGHT REMINDER · 9:00 PM</p>
        <p className="mt-3 text-3xl font-bold">Atorvastatin</p>
        <p className="mt-1 text-sm opacity-90">10mg · 1 tablet after dinner</p>
      </div>
      <div className="mt-7 grid grid-cols-2 gap-3">
        <PrimaryButton variant="outline" onClick={() => navigate({ to: "/medicine/missed" })}><X className="h-4 w-4" /> Skip</PrimaryButton>
        <PrimaryButton onClick={() => navigate({ to: "/medicine/taken" })}><Check className="h-4 w-4" /> Taken</PrimaryButton>
      </div>
    </Screen>
  );
}

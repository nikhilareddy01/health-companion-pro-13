import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";

export const Route = createFileRoute("/medicine/missed")({ component: Page });

function Page() {
  const navigate = useNavigate();
  return (
    <div className="mobile-frame flex flex-col items-center justify-between px-8 py-16 bg-background">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-[oklch(0.96_0.05_75)]">
          <AlertTriangle className="h-16 w-16 text-[oklch(0.6_0.18_55)]" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Missed dose</h1>
        <p className="mt-3 text-sm text-muted-foreground">You missed your Metformin dose. Would you like to take it now or re-schedule for later?</p>
      </div>
      <div className="w-full space-y-3">
        <PrimaryButton onClick={() => navigate({ to: "/medicine/taken" })}>Take it now</PrimaryButton>
        <PrimaryButton variant="outline" onClick={() => navigate({ to: "/medicine-overview" })}>Re-schedule</PrimaryButton>
      </div>
    </div>
  );
}

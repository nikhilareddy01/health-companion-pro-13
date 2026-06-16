import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";

export const Route = createFileRoute("/medicine/taken")({ component: Page });

function Page() {
  const navigate = useNavigate();
  return (
    <div className="mobile-frame flex flex-col items-center justify-between px-8 py-16" style={{ background: "var(--gradient-hero)" }}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-success/15 animate-in zoom-in duration-500">
          <CheckCircle2 className="h-20 w-20 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Great job!</h1>
        <p className="mt-3 text-sm text-muted-foreground">Metformin 500mg marked as taken. Keep up the consistency!</p>
      </div>
      <div className="w-full space-y-3">
        <PrimaryButton onClick={() => navigate({ to: "/medicine-overview" })}>Back to medicines</PrimaryButton>
        <PrimaryButton variant="ghost" onClick={() => navigate({ to: "/dashboard" })}>Home</PrimaryButton>
      </div>
    </div>
  );
}

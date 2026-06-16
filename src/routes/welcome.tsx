import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";

export const Route = createFileRoute("/welcome")({ component: Page });

function Page() {
  const navigate = useNavigate();
  return (
    <div className="mobile-frame flex flex-col items-center justify-between px-8 py-16" style={{ background: "var(--gradient-hero)" }}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-success/15 animate-in zoom-in duration-500">
          <CheckCircle2 className="h-20 w-20 text-success" strokeWidth={2} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">You're all set!</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Welcome to MediCare AI. Let's start building your healthier routine today.</p>
      </div>
      <div className="w-full">
        <PrimaryButton onClick={() => navigate({ to: "/dashboard" })}>Continue to Dashboard</PrimaryButton>
      </div>
    </div>
  );
}

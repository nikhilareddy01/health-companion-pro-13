import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";

export const Route = createFileRoute("/onboarding-1")({ component: Page });

function Page() {
  const navigate = useNavigate();
  return (
    <div className="mobile-frame flex flex-col" style={{ background: "var(--gradient-hero)" }}>
      <div className="flex justify-end px-6 pt-6">
        <Link to="/signup" className="text-sm font-medium text-muted-foreground">Skip</Link>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="mb-10 flex h-44 w-44 items-center justify-center rounded-[3rem] shadow-[var(--shadow-float)]" style={{ background: "var(--gradient-primary)" }}>
          <Activity className="h-20 w-20 text-white" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Track Your Health</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Monitor blood pressure, sugar, heart rate, sleep and more — all in one place.</p>
      </div>
      <div className="px-8 pb-10">
        <div className="mb-6 flex justify-center gap-2">
          <span className="h-2 w-8 rounded-full bg-primary" />
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
        </div>
        <PrimaryButton onClick={() => navigate({ to: "/onboarding-2" })}>Next</PrimaryButton>
      </div>
    </div>
  );
}

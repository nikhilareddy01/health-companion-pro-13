import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BellRing } from "lucide-react";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";

export const Route = createFileRoute("/onboarding-3")({ component: Page });

function Page() {
  const navigate = useNavigate();
  return (
    <div className="mobile-frame flex flex-col" style={{ background: "var(--gradient-hero)" }}>
      <div className="flex flex-1 flex-col items-center justify-center px-8 pt-16 text-center">
        <div className="mb-10 flex h-44 w-44 items-center justify-center rounded-[3rem] shadow-[var(--shadow-float)]" style={{ background: "var(--gradient-primary)" }}>
          <BellRing className="h-20 w-20 text-white" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Smart Medicine Reminders</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Never miss a dose. We'll remind you at the right time, every time.</p>
      </div>
      <div className="px-8 pb-10">
        <div className="mb-6 flex justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-8 rounded-full bg-primary" />
        </div>
        <PrimaryButton onClick={() => navigate({ to: "/signup" })}>Get Started</PrimaryButton>
      </div>
    </div>
  );
}

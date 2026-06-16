import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";

export const Route = createFileRoute("/profile/about")({ component: Page });

function Page() {
  return (
    <Screen title="About" contentClass="px-5 pb-8">
      <div className="flex flex-col items-center pt-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl shadow-[var(--shadow-float)]" style={{ background: "var(--gradient-primary)" }}>
          <Heart className="h-10 w-10 text-white" fill="white" />
        </div>
        <p className="mt-4 text-xl font-bold text-foreground">MediCare AI</p>
        <p className="text-xs text-muted-foreground">Version 1.0.0</p>
      </div>
      <div className="mt-8 space-y-3">
        <Info label="Developer" value="MediCare Health Inc." />
        <Info label="Released" value="May 2026" />
        <Info label="Support" value="support@medicare.app" />
      </div>
      <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">By using MediCare AI you agree to our Terms & Conditions and Privacy Policy. This app is not a substitute for professional medical advice.</p>
    </Screen>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

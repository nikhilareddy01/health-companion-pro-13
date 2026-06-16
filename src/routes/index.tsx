import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediCare AI — Your Health Companion" },
      { name: "description", content: "AI-powered healthcare, diet guidance and medication reminders." },
    ],
  }),
  component: SplashScreen,
});

function SplashScreen() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/onboarding-1" }), 1600);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="mobile-frame flex flex-col items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
      <div className="flex flex-col items-center gap-5 animate-in fade-in zoom-in duration-700">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl shadow-[var(--shadow-float)]" style={{ background: "var(--gradient-primary)" }}>
          <Heart className="h-12 w-12 text-white" fill="white" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">MediCare AI</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your personal health companion</p>
        </div>
      </div>
      <div className="absolute bottom-12 flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:200ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:400ms]" />
      </div>
    </div>
  );
}

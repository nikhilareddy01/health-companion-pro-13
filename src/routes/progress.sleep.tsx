import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/progress/sleep")({ component: Page });

function Page() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [hours, setHours] = useState<number>(7.5);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      const uid = data?.user?.id || null;
      setUserId(uid);
      const userKey = uid || "guest";
      const saved = localStorage.getItem(`sleep_${userKey}`);
      if (saved) {
        setHours(Number(saved) || 7.5);
      }
    });
  }, []);

  const handleSave = () => {
    const userKey = userId || "guest";
    localStorage.setItem(`sleep_${userKey}`, String(hours));
    toast.success(`Sleep logged: ${hours} hours`);
    navigate({ to: "/progress" });
  };

  return (
    <Screen title="Sleep Tracking" contentClass="px-5 pb-8">
      <div
        className="rounded-3xl p-6 text-primary-foreground shadow-[var(--shadow-float)]"
        style={{
          background: "linear-gradient(135deg, oklch(0.5 0.13 270), oklch(0.4 0.13 290))",
        }}
      >
        <Moon className="h-7 w-7" />
        <p className="mt-3 text-xs opacity-90">SLEEP LOGGED FOR TODAY</p>
        <p className="text-3xl font-bold">{hours} hours</p>
      </div>

      <div className="mt-6 rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] space-y-4">
        <label className="text-sm font-semibold text-foreground">How many hours did you sleep?</label>
        <div className="flex items-center justify-between text-2xl font-bold text-primary">
          <span>{hours} hrs</span>
        </div>
        <input
          type="range"
          min={1}
          max={14}
          step={0.5}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 hr</span>
          <span>7.5 hrs</span>
          <span>14 hrs</span>
        </div>
      </div>

      <div className="mt-8">
        <PrimaryButton onClick={handleSave}>Save Sleep Record</PrimaryButton>
      </div>
    </Screen>
  );
}

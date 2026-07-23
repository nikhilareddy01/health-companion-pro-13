import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/progress/pain")({ component: Page });

function Page() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [level, setLevel] = useState(4);
  const colors = [
    "bg-success",
    "bg-success",
    "bg-success",
    "bg-warning",
    "bg-warning",
    "bg-warning",
    "bg-warning",
    "bg-destructive",
    "bg-destructive",
    "bg-destructive",
    "bg-destructive",
  ];

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      const uid = data?.user?.id || null;
      setUserId(uid);
      const userKey = uid || "guest";
      const saved = localStorage.getItem(`pain_${userKey}`);
      if (saved) {
        setLevel(Number(saved) || 0);
      }
    });
  }, []);

  const handleSave = () => {
    const userKey = userId || "guest";
    localStorage.setItem(`pain_${userKey}`, String(level));
    toast.success(`Pain level saved: ${level}/10`);
    navigate({ to: "/progress" });
  };

  return (
    <Screen title="Pain Level Tracker" contentClass="px-5 pb-8">
      <p className="text-sm text-muted-foreground">Rate your current pain level (0 = none, 10 = severe).</p>
      <div className="mt-6 flex items-center justify-center">
        <div className="text-7xl font-bold text-foreground">{level}</div>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        value={level}
        onChange={(e) => setLevel(Number(e.target.value))}
        className="mt-6 w-full accent-[oklch(0.7_0.13_175)]"
      />
      <div className="mt-3 flex justify-between text-xs text-muted-foreground">
        <span>None</span>
        <span>Mild</span>
        <span>Severe</span>
      </div>
      <div className="mt-4 flex gap-1">
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full ${i <= level ? colors[i] : "bg-muted"}`} />
        ))}
      </div>
      <div className="mt-10">
        <PrimaryButton onClick={handleSave}>Save Pain Level</PrimaryButton>
      </div>
    </Screen>
  );
}

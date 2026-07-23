import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/progress/symptoms")({ component: Page });

const initialSymptoms = ["Headache", "Fatigue", "Dizziness", "Nausea", "Chest tightness", "Joint pain", "Cough", "Fever"];

function Page() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [sel, setSel] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      const uid = data?.user?.id || null;
      setUserId(uid);
      const userKey = uid || "guest";
      const saved = localStorage.getItem(`symptoms_${userKey}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setSel(parsed);
        } catch (err) {
          console.error(err);
        }
      }
    });
  }, []);

  const toggle = (s: string) => setSel((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const handleSave = () => {
    const userKey = userId || "guest";
    localStorage.setItem(`symptoms_${userKey}`, JSON.stringify(sel));
    toast.success(sel.length > 0 ? `Symptoms saved: ${sel.join(", ")}` : "Symptoms updated!");
    navigate({ to: "/progress" });
  };

  return (
    <Screen title="Symptom Tracker" contentClass="px-5 pb-8">
      <p className="text-sm text-muted-foreground">What health symptoms are you experiencing today?</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {initialSymptoms.map((s) => (
          <button
            key={s}
            onClick={() => toggle(s)}
            className={`rounded-full px-4 py-2.5 text-xs font-semibold transition-all ${
              sel.includes(s) ? "bg-primary text-primary-foreground shadow-sm scale-105" : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {s} {sel.includes(s) && "✓"}
          </button>
        ))}
      </div>
      <div className="mt-8">
        <PrimaryButton onClick={handleSave}>Save Symptoms</PrimaryButton>
      </div>
    </Screen>
  );
}

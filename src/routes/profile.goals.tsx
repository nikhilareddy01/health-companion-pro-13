import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CheckCircle2, Loader2, Edit3, Check } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { toast } from "sonner";
import { getApiUrl } from "@/utils/api";

export const Route = createFileRoute("/profile/goals")({ component: Page });

function Page() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedModal, setSavedModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Goals states
  const [weightGoal, setWeightGoal] = useState("Reach 65 kg");
  const [activityGoal, setActivityGoal] = useState("8,000 steps · 30 min activity");
  const [adherenceGoal, setAdherenceGoal] = useState("100% on-time doses");
  const [dietGoal, setDietGoal] = useState("1,800 kcal · low GI meals");

  useEffect(() => {
    const loadGoals = async (uid: string) => {
      try {
        const res = await fetch(getApiUrl(`/api/profiles/${uid}`));
        if (res.ok) {
          const data = await res.json();
          if (data && data.goals) {
            const g = data.goals;
            if (g.weight) setWeightGoal(g.weight);
            if (g.activity) setActivityGoal(g.activity);
            if (g.adherence) setAdherenceGoal(g.adherence);
            if (g.diet) setDietGoal(g.diet);
          }
        }
      } catch (err) {
        console.error("Failed to load goals:", err);
      } finally {
        setLoading(false);
      }
    };

    import("@/integrations/supabase/client").then(({ supabase }) => {
      supabase.auth.getUser().then(({ data }: { data: any }) => {
        if (data?.user) {
          setUserId(data.user.id);
          loadGoals(data.user.id);
        } else {
          setLoading(false);
        }
      });
    });
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userId) {
      setSavedModal(true);
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      const goalsObj = {
        weight: weightGoal,
        activity: activityGoal,
        adherence: adherenceGoal,
        diet: dietGoal
      };

      const res = await fetch(getApiUrl(`/api/profiles/${userId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goals: goalsObj }),
      });

      if (!res.ok) throw new Error("Failed to save goals");
      setSavedModal(true);
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save goals to backend");
    } finally {
      setSaving(false);
    }
  };

  const goalsList = [
    { label: "WEIGHT MANAGEMENT", value: weightGoal, set: setWeightGoal, placeholder: "e.g. Reach 65 kg" },
    { label: "DAILY HEALTH", value: activityGoal, set: setActivityGoal, placeholder: "e.g. 10,000 steps" },
    { label: "MEDICINE ADHERENCE", value: adherenceGoal, set: setAdherenceGoal, placeholder: "e.g. 100% on-time" },
    { label: "DIET", value: dietGoal, set: setDietGoal, placeholder: "e.g. 1,800 kcal · low carb" },
  ];

  return (
    <Screen 
      title="Goals" 
      headerRight={
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
          className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground hover:bg-muted/80 transition"
        >
          {isEditing ? <Check className="h-4 w-4 text-primary" /> : <Edit3 className="h-4 w-4" />}
        </button>
      }
      contentClass="px-5 pb-8"
    >
      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Loading goals...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-3">
            {goalsList.map((g) => (
              <div key={g.label} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] min-h-[72px] flex flex-col justify-center">
                <p className="text-xs font-medium text-muted-foreground">{g.label}</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={g.value}
                    onChange={(e) => g.set(e.target.value)}
                    placeholder={g.placeholder}
                    className="mt-2 text-sm font-semibold text-foreground bg-muted px-2 py-1 rounded-md outline-none focus:ring-1 focus:ring-primary w-full"
                  />
                ) : (
                  <p className="mt-1 text-sm font-semibold text-foreground">{g.value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            {isEditing ? (
              <PrimaryButton type="submit" disabled={saving}>
                {saving ? "Saving goals..." : "Save Goals"}
              </PrimaryButton>
            ) : (
              <PrimaryButton type="button" onClick={() => setIsEditing(true)}>
                Edit Goals
              </PrimaryButton>
            )}
          </div>
        </form>
      )}

      {savedModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-6 sm:items-center" onClick={() => setSavedModal(false)}>
          <div className="w-full max-w-sm rounded-3xl bg-background p-7 text-center border border-border shadow-[var(--shadow-float)]">
            <CheckCircle2 className="mx-auto h-14 w-14 text-success animate-bounce" />
            <p className="mt-3 text-lg font-bold text-foreground">Goals saved</p>
            <p className="mt-1 text-sm text-muted-foreground">We'll keep you on track.</p>
            <PrimaryButton className="mt-5" onClick={() => setSavedModal(false)}>Done</PrimaryButton>
          </div>
        </div>
      )}
    </Screen>
  );
}

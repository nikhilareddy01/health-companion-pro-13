import { createFileRoute } from "@tanstack/react-router";
import { Check, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Screen } from "@/components/mobile/Screen";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/diseases")({ component: Page });

const initialList = [
  "Diabetes Type 2",
  "Hypertension",
  "Migraine",
  "Asthma",
  "PCOS",
  "Thyroid",
  "High Cholesterol",
  "Acidity / GERD",
  "Arthritis",
  "Anxiety",
];

function Page() {
  const [userId, setUserId] = useState<string | null>(null);
  const [conditionsList, setConditionsList] = useState<string[]>(initialList);
  const [selected, setSelected] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      const uid = data?.user?.id || null;
      setUserId(uid);
      const userKey = uid || "guest";

      // Load User Saved Conditions
      const savedSelected = localStorage.getItem(`user_conditions_${userKey}`);
      if (savedSelected) {
        try {
          const parsed = JSON.parse(savedSelected);
          if (Array.isArray(parsed)) {
            setSelected(parsed);
          } else {
            setSelected([]);
          }
        } catch {
          setSelected([]);
        }
      } else {
        // Start completely empty for new users!
        setSelected([]);
      }

      // Load Custom Conditions
      const savedCustom = localStorage.getItem(`custom_conditions_${userKey}`);
      if (savedCustom) {
        try {
          const parsedCustom = JSON.parse(savedCustom);
          if (Array.isArray(parsedCustom)) {
            setConditionsList([...initialList, ...parsedCustom]);
          }
        } catch {
          // Keep defaults
        }
      }
    });
  }, []);

  const toggle = (d: string) => {
    const next = selected.includes(d)
      ? selected.filter((x) => x !== d)
      : [...selected, d];

    setSelected(next);
    const userKey = userId || "guest";
    localStorage.setItem(`user_conditions_${userKey}`, JSON.stringify(next));

    if (next.includes(d)) {
      toast.success(`Selected condition: ${d}`);
    } else {
      toast.info(`Deselected condition: ${d}`);
    }
  };

  const handleAddCondition = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCondition.trim();
    if (!trimmed) {
      toast.error("Please enter a condition name");
      return;
    }
    if (conditionsList.includes(trimmed)) {
      if (!selected.includes(trimmed)) {
        toggle(trimmed);
      }
      setNewCondition("");
      return;
    }

    const updatedList = [...conditionsList, trimmed];
    const updatedSelected = [...selected, trimmed];

    setConditionsList(updatedList);
    setSelected(updatedSelected);
    setNewCondition("");

    const userKey = userId || "guest";
    const customOnly = updatedList.filter((c) => !initialList.includes(c));
    localStorage.setItem(`custom_conditions_${userKey}`, JSON.stringify(customOnly));
    localStorage.setItem(`user_conditions_${userKey}`, JSON.stringify(updatedSelected));

    toast.success(`Added & selected new condition: "${trimmed}"`);
  };

  const handleRemoveCondition = (e: React.MouseEvent, d: string) => {
    e.stopPropagation();
    const updatedList = conditionsList.filter((c) => c !== d);
    const updatedSelected = selected.filter((c) => c !== d);

    setConditionsList(updatedList);
    setSelected(updatedSelected);

    const userKey = userId || "guest";
    const customOnly = updatedList.filter((c) => !initialList.includes(c));
    localStorage.setItem(`custom_conditions_${userKey}`, JSON.stringify(customOnly));
    localStorage.setItem(`user_conditions_${userKey}`, JSON.stringify(updatedSelected));

    toast.info(`Removed condition "${d}"`);
  };

  return (
    <Screen title="My Conditions" contentClass="px-5 pb-8">
      <p className="text-sm text-muted-foreground">
        Select or add the health conditions you are managing. We'll tailor your personalized plan accordingly.
      </p>

      {/* Add Custom Condition Form */}
      <form onSubmit={handleAddCondition} className="mt-4 flex gap-2">
        <input
          type="text"
          value={newCondition}
          onChange={(e) => setNewCondition(e.target.value)}
          placeholder="Add a new condition (e.g. Sinusitis)..."
          className="h-12 flex-1 rounded-2xl bg-muted px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="flex h-12 items-center gap-1.5 rounded-2xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      {/* Conditions Selection List */}
      <div className="mt-5 space-y-2.5">
        {conditionsList.map((d) => {
          const on = selected.includes(d);
          const isCustom = !initialList.includes(d);
          return (
            <button
              key={d}
              onClick={() => toggle(d)}
              className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                on ? "border-primary bg-primary-soft/50 shadow-sm" : "border-border bg-card"
              }`}
            >
              <span className={`text-sm font-medium ${on ? "text-primary font-semibold" : "text-foreground"}`}>
                {d} {isCustom && <span className="text-[10px] text-muted-foreground ml-1">(Custom)</span>}
              </span>
              <div className="flex items-center gap-2">
                {isCustom && (
                  <span
                    onClick={(e) => handleRemoveCondition(e, d)}
                    title="Remove custom condition"
                    className="p-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </span>
                )}
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full transition-all ${
                    on ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {on && <Check className="h-3.5 w-3.5" />}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </Screen>
  );
}

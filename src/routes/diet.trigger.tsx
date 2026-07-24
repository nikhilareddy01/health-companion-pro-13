import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { AlertTriangle, Plus, Pencil, Trash2, Check, X, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/diet/trigger")({ component: Page });

interface TriggerFood {
  id: string;
  name: string;
  symptom: string;
}

function Page() {
  const [userId, setUserId] = useState<string | null>(null);
  const [triggerFoods, setTriggerFoods] = useState<TriggerFood[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSymptom, setNewSymptom] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSymptom, setEditSymptom] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      const uid = data?.user?.id || null;
      setUserId(uid);
      const storageKey = `user_trigger_foods_${uid || "guest"}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setTriggerFoods(JSON.parse(saved));
        } catch (e) {
          setTriggerFoods([]);
        }
      } else {
        setTriggerFoods([]);
      }
    });
  }, []);

  const saveToStorage = (updated: TriggerFood[]) => {
    setTriggerFoods(updated);
    const storageKey = `user_trigger_foods_${userId || "guest"}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Please enter a food item name");
      return;
    }
    const newItem: TriggerFood = {
      id: Date.now().toString(),
      name: newName.trim(),
      symptom: newSymptom.trim() || "Triggers symptoms",
    };
    const updated = [newItem, ...triggerFoods];
    saveToStorage(updated);
    setNewName("");
    setNewSymptom("");
    setIsAdding(false);
    toast.success("Trigger food added");
  };

  const startEdit = (item: TriggerFood) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditSymptom(item.symptom);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) {
      toast.error("Food name cannot be empty");
      return;
    }
    const updated = triggerFoods.map((item) =>
      item.id === id
        ? { ...item, name: editName.trim(), symptom: editSymptom.trim() || "Triggers symptoms" }
        : item
    );
    saveToStorage(updated);
    setEditingId(null);
    toast.success("Trigger food updated");
  };

  const handleDelete = (id: string) => {
    const updated = triggerFoods.filter((item) => item.id !== id);
    saveToStorage(updated);
    toast.success("Trigger food removed");
  };

  return (
    <Screen title="Trigger Food Alert" contentClass="px-5 pb-8">
      {/* Alert Header Banner */}
      <div className="rounded-3xl bg-[oklch(0.96_0.05_75)] p-5 text-[oklch(0.4_0.1_75)]">
        <AlertTriangle className="h-7 w-7" />
        <p className="mt-3 text-base font-bold">
          {triggerFoods.length === 0
            ? "No trigger foods recorded"
            : `${triggerFoods.length} trigger food${triggerFoods.length === 1 ? "" : "s"} tracked`}
        </p>
        <p className="mt-1 text-sm">
          Tracking foods that worsen your symptoms. Add, edit, or manage your food items below.
        </p>
      </div>

      {/* Add New Trigger Food Section */}
      <div className="mt-5">
        {!isAdding ? (
          <PrimaryButton variant="outline" size="md" onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4" /> Add Trigger Food
          </PrimaryButton>
        ) : (
          <form onSubmit={handleAdd} className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Add New Trigger Food</h3>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Food Item Name *</label>
              <input
                type="text"
                placeholder="e.g., Coffee, Dairy, Spicy Curry"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Symptom / Reaction Note</label>
              <input
                type="text"
                placeholder="e.g., Causes acidity, Migraine trigger"
                value={newSymptom}
                onChange={(e) => setNewSymptom(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <PrimaryButton type="submit" size="sm">
                Save Food Item
              </PrimaryButton>
              <PrimaryButton type="button" variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </PrimaryButton>
            </div>
          </form>
        )}
      </div>

      {/* Trigger Foods List */}
      <div className="mt-5 space-y-3">
        {triggerFoods.length === 0 ? (
          <div className="rounded-2xl bg-card p-6 text-center shadow-[var(--shadow-soft)]">
            <Utensils className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-medium text-foreground">No custom trigger foods added</p>
            <p className="text-xs text-muted-foreground mt-1">
              Tap "Add Trigger Food" above to enter food items that trigger or worsen your symptoms.
            </p>
          </div>
        ) : (
          triggerFoods.map((item) => (
            <div key={item.id} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] transition-all">
              {editingId === item.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Food Item Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Symptom / Reaction</label>
                    <input
                      type="text"
                      value={editSymptom}
                      onChange={(e) => setEditSymptom(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium"
                    >
                      <Check className="h-3.5 w-3.5" /> Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-foreground text-xs font-medium"
                    >
                      <X className="h-3.5 w-3.5" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.symptom}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(item)}
                      title="Edit food item"
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Delete food item"
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-muted"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Screen>
  );
}

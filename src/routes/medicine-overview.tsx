import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, Pill, Sun, Moon, Sunset, Check, X, RefreshCw } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getApiUrl } from "@/utils/api";

export const Route = createFileRoute("/medicine-overview")({ component: Page });

const iconMap: Record<string, any> = {
  Sun,
  Pill,
  Moon,
  Sunset,
};

function Page() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadMeds = async (uid?: string) => {
      const storageKey = uid ? `medicines_${uid}` : "medicines";
      if (uid) {
        try {
          const res = await fetch(getApiUrl(`/api/medicines?user_id=${uid}`));
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setMedicines(data);
              localStorage.setItem(storageKey, JSON.stringify(data));
              return;
            }
          }
        } catch (err) {
          console.error("Failed to load medicines from backend:", err);
        }
      }

      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setMedicines(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          setMedicines([]);
        }
      } else {
        setMedicines([]);
      }
    };

    import("@/integrations/supabase/client").then(({ supabase }) => {
      supabase.auth.getUser().then(({ data }: { data: any }) => {
        if (data?.user) {
          setUserId(data.user.id);
          loadMeds(data.user.id);
        } else {
          loadMeds();
        }
      });
    });
  }, []);

  const updateMedicineOnBackend = async (id: string, updates: any) => {
    if (userId && isNaN(Number(id))) {
      try {
        await fetch(getApiUrl(`/api/medicines/${id}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
      } catch (err) {
        console.error("Failed to update medicine on backend:", err);
      }
    }
  };

  const handleTake = (id: string) => {
    const updated = medicines.map((m) => (m.id === id ? { ...m, taken: true, skipped: false } : m));
    setMedicines(updated);
    const storageKey = userId ? `medicines_${userId}` : "medicines";
    localStorage.setItem(storageKey, JSON.stringify(updated));
    toast.success("Medicine marked as taken!");
    updateMedicineOnBackend(id, { taken: true, skipped: false });
  };

  const handleSkip = (id: string) => {
    const updated = medicines.map((m) => (m.id === id ? { ...m, taken: false, skipped: true } : m));
    setMedicines(updated);
    const storageKey = userId ? `medicines_${userId}` : "medicines";
    localStorage.setItem(storageKey, JSON.stringify(updated));
    toast.info("Medicine marked as skipped.");
    updateMedicineOnBackend(id, { taken: false, skipped: true });
  };

  const handleReset = (id: string) => {
    const updated = medicines.map((m) => (m.id === id ? { ...m, taken: false, skipped: false } : m));
    setMedicines(updated);
    const storageKey = userId ? `medicines_${userId}` : "medicines";
    localStorage.setItem(storageKey, JSON.stringify(updated));
    toast.info("Status reset.");
    updateMedicineOnBackend(id, { taken: false, skipped: false });
  };

  const total = medicines.length;
  const takenCount = medicines.filter((m) => m.taken).length;
  const missedCount = medicines.filter((m) => m.skipped).length;

  return (
    <Screen
      title="Medicines"
      headerRight={
        <button
          onClick={() => navigate({ to: "/medicine/add" })}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:opacity-90"
        >
          <Plus className="h-5 w-5" />
        </button>
      }
      contentClass="px-5 pb-8"
    >
      {/* Overview Stat Chips */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <Link to="/medicine/schedule" className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <p className="text-xl font-bold text-foreground">{total}</p>
          <p className="text-[11px] text-muted-foreground">Today</p>
        </Link>
        <Link to="/medicine/taken" className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <p className="text-xl font-bold text-foreground">{takenCount}</p>
          <p className="text-[11px] text-muted-foreground">Taken</p>
        </Link>
        <Link to="/medicine/missed" className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <p className="text-xl font-bold text-foreground">{missedCount}</p>
          <p className="text-[11px] text-muted-foreground">Missed</p>
        </Link>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Scheduled today</h2>
        <Link to="/medicine/add" className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
          <Plus className="h-3.5 w-3.5" /> Add Medicine
        </Link>
      </div>

      {/* Medicines List */}
      <div className="mt-3 space-y-3">
        {medicines.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-muted bg-card p-8 text-center shadow-[var(--shadow-soft)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Pill className="h-7 w-7" />
            </div>
            <p className="mt-4 text-base font-bold text-foreground">No medicines added yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              You haven't set up any medication schedules. Click below to add your first medicine.
            </p>
            <button
              onClick={() => navigate({ to: "/medicine/add" })}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-md hover:opacity-90 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" /> Add New Medicine
            </button>
          </div>
        ) : (
          medicines.map((m) => {
            const IconComponent = iconMap[m.icon] || Pill;
            return (
              <div
                key={m.id}
                className={`rounded-2xl p-4 transition-all shadow-[var(--shadow-soft)] ${
                  m.taken
                    ? "bg-emerald-500/10 border border-emerald-500/30"
                    : m.skipped
                    ? "bg-amber-500/10 border border-amber-500/30 opacity-70"
                    : "bg-card"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      m.color === "primary"
                        ? "bg-primary-soft text-primary"
                        : "bg-secondary-soft text-secondary"
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{m.name}</p>
                      <span className="text-xs text-muted-foreground">· {m.dose}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      1 tablet after meal
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {m.time || "Scheduled"}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
                  {m.taken ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <Check className="h-4 w-4" /> Taken
                      </span>
                      <button
                        onClick={() => handleReset(m.id)}
                        className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                      >
                        <RefreshCw className="h-3 w-3" /> Reset
                      </button>
                    </div>
                  ) : m.skipped ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                        <X className="h-4 w-4" /> Skipped
                      </span>
                      <button
                        onClick={() => handleReset(m.id)}
                        className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                      >
                        <RefreshCw className="h-3 w-3" /> Reset
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2 w-full">
                      <button
                        onClick={() => handleSkip(m.id)}
                        className="flex items-center gap-1 rounded-xl bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/80"
                      >
                        <X className="h-3.5 w-3.5" /> Skip
                      </button>
                      <button
                        onClick={() => handleTake(m.id)}
                        className="flex items-center gap-1 rounded-xl bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-600"
                      >
                        <Check className="h-3.5 w-3.5" /> Take
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Screen>
  );
}

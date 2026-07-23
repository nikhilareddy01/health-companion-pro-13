import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, Pill, Sun, Moon, Sunset, Check, X, RefreshCw } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getApiUrl } from "@/utils/api";

export const Route = createFileRoute("/medicine-overview")({ component: Page });

const defaultMeds = [
  { id: "1", name: "Metformin", dose: "500mg", time: "8:00 AM", icon: "Sun", color: "primary", to: "/medicine/morning", taken: false, skipped: false },
  { id: "2", name: "Vitamin D3", dose: "1000 IU", time: "1:00 PM", icon: "Pill", color: "secondary", to: "/medicine/schedule", taken: false, skipped: false },
  { id: "3", name: "Atorvastatin", dose: "10mg", time: "9:00 PM", icon: "Moon", color: "primary", to: "/medicine/night", taken: false, skipped: false },
];

const iconMap: Record<string, any> = {
  Sun,
  Pill,
  Moon,
  Sunset
};

function Page() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadMeds = async (uid?: string) => {
      const storageKey = uid ? `medicines_${uid}` : 'medicines';
      if (uid) {
        try {
          const res = await fetch(getApiUrl(`/api/medicines?user_id=${uid}`));
          if (res.ok) {
            const data = await res.json();
            setMedicines(data);
            localStorage.setItem(storageKey, JSON.stringify(data));
            return;
          }
        } catch (err) {
          console.error("Failed to load medicines from backend:", err);
        }
      }
      
      const saved = localStorage.getItem(storageKey) || localStorage.getItem('medicines');
      if (saved) {
        try {
          setMedicines(JSON.parse(saved));
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
    // Check if it's a numeric temp ID generated locally.
    // If it's a UUID, we can update it on the backend.
    if (userId && isNaN(Number(id))) {
      try {
        await fetch(getApiUrl(`/api/medicines/${id}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
      } catch (err) {
        console.error("Failed to sync medicine update with backend:", err);
      }
    }
  };

  const handleTake = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updates = { taken: true, skipped: false };
    const updated = medicines.map((m) => m.id === id ? { ...m, ...updates } : m);
    setMedicines(updated);
    localStorage.setItem('medicines', JSON.stringify(updated));
    toast.success("Medicine marked as taken!");
    await updateMedicineOnBackend(id, updates);
  };

  const handleSkip = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updates = { taken: false, skipped: true };
    const updated = medicines.map((m) => m.id === id ? { ...m, ...updates } : m);
    setMedicines(updated);
    localStorage.setItem('medicines', JSON.stringify(updated));
    toast.error("Medicine marked as skipped");
    await updateMedicineOnBackend(id, updates);
  };

  const handleReset = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updates = { taken: false, skipped: false };
    const updated = medicines.map((m) => m.id === id ? { ...m, ...updates } : m);
    setMedicines(updated);
    localStorage.setItem('medicines', JSON.stringify(updated));
    await updateMedicineOnBackend(id, updates);
  };

  const todayCount = medicines.length;
  const takenCount = medicines.filter(m => m.taken).length;
  const missedCount = medicines.filter(m => m.skipped).length;

  return (
    <Screen
      title="Medicines"
      headerRight={
        <Link to="/medicine/add" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Plus className="h-5 w-5" />
        </Link>
      }
      contentClass="px-5 pb-8"
      bottomNav
    >
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Today" value={todayCount.toString()} />
        <Stat label="Taken" value={takenCount.toString()} />
        <Stat label="Missed" value={missedCount.toString()} />
      </div>
      <h2 className="mt-6 text-sm font-semibold text-foreground">Scheduled today</h2>
      <div className="mt-3 space-y-3">
        {medicines.map((m) => {
          const IconComp = iconMap[m.icon] || Pill;
          return (
            <div 
              key={m.id} 
              onClick={() => m.to ? navigate({ to: m.to }) : null} 
              className={`flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] transition-all ${m.to ? "cursor-pointer hover:bg-card/85" : ""}`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${m.color === "primary" ? "bg-primary-soft text-primary" : "bg-secondary-soft text-secondary"}`}>
                  <IconComp className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {m.name} <span className="font-normal text-muted-foreground">· {m.dose}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">1 tablet after meal</p>
                </div>
                <span className="text-xs font-semibold text-foreground">{m.time}</span>
              </div>
              
              <div className="flex items-center justify-end border-t border-muted/50 pt-2.5 gap-2">
                {m.taken ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                      <Check className="h-3 w-3" /> Taken
                    </span>
                    <button onClick={(e) => handleReset(m.id, e)} className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1">
                      <RefreshCw className="h-2.5 w-2.5" /> Reset
                    </button>
                  </div>
                ) : m.skipped ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive">
                      <X className="h-3 w-3" /> Skipped
                    </span>
                    <button onClick={(e) => handleReset(m.id, e)} className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1">
                      <RefreshCw className="h-2.5 w-2.5" /> Reset
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 w-full justify-end">
                    <button onClick={(e) => handleSkip(m.id, e)} className="flex h-8 items-center gap-1 rounded-lg bg-muted px-3 text-xs font-medium text-muted-foreground hover:bg-muted/80">
                      <X className="h-3.5 w-3.5" /> Skip
                    </button>
                    <button onClick={(e) => handleTake(m.id, e)} className="flex h-8 items-center gap-1 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/95">
                      <Check className="h-3.5 w-3.5" /> Take
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link to="/medicine/history" className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <p className="text-sm font-semibold text-foreground">History</p>
          <p className="text-xs text-muted-foreground">Adherence log</p>
        </Link>
        <Link to="/medicine/insights" className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <p className="text-sm font-semibold text-foreground">AI insights</p>
          <p className="text-xs text-muted-foreground">Interactions & tips</p>
        </Link>
        <Link to="/medicine/prescription" className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <p className="text-sm font-semibold text-foreground">Prescriptions</p>
          <p className="text-xs text-muted-foreground">Upload & scan</p>
        </Link>
        <Link to="/medicine/emergency" className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <p className="text-sm font-semibold text-destructive">Emergency</p>
          <p className="text-xs text-muted-foreground">Critical alerts</p>
        </Link>
      </div>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-3 text-center shadow-[var(--shadow-soft)]">
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

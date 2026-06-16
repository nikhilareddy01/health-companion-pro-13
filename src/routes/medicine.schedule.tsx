import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sun, Sunset, Moon } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { toast } from "sonner";

export const Route = createFileRoute("/medicine/schedule")({ component: Page });

function Page() {
  const navigate = useNavigate();
  const [times, setTimes] = useState<string[]>(["Morning"]);
  const [duration, setDuration] = useState(30);
  const toggle = (t: string) => setTimes((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));
  return (
    <Screen title="Schedule" contentClass="px-5 pb-8">
      <p className="text-sm text-muted-foreground">When should we remind you?</p>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[{ k: "Morning", Icon: Sun, t: "8:00 AM" }, { k: "Afternoon", Icon: Sunset, t: "1:00 PM" }, { k: "Night", Icon: Moon, t: "9:00 PM" }].map((s) => {
          const on = times.includes(s.k);
          return (
            <button key={s.k} onClick={() => toggle(s.k)} className={`rounded-2xl border p-4 text-center transition ${on ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-foreground"}`}>
              <s.Icon className="mx-auto h-6 w-6" />
              <p className="mt-2 text-xs font-semibold">{s.k}</p>
              <p className="text-[10px] text-muted-foreground">{s.t}</p>
            </button>
          );
        })}
      </div>
      <div className="mt-7">
        <p className="text-xs font-medium text-muted-foreground">Duration · {duration} days</p>
        <input type="range" min={1} max={90} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="mt-3 w-full accent-[oklch(0.7_0.13_175)]" />
      </div>
      <div className="mt-10">
        <PrimaryButton onClick={() => { 
          const pendingStr = localStorage.getItem('pending_medicine');
          if (pendingStr) {
            try {
              const pending = JSON.parse(pendingStr);
              const currentMedsStr = localStorage.getItem('medicines');
              const currentMeds = currentMedsStr ? JSON.parse(currentMedsStr) : [
                { id: "1", name: "Metformin", dose: "500mg", time: "8:00 AM", icon: "Sun", color: "primary", to: "/medicine/morning", taken: false, skipped: false },
                { id: "2", name: "Vitamin D3", dose: "1000 IU", time: "1:00 PM", icon: "Pill", color: "secondary", to: "/medicine/schedule", taken: false, skipped: false },
                { id: "3", name: "Atorvastatin", dose: "10mg", time: "9:00 PM", icon: "Moon", color: "primary", to: "/medicine/night", taken: false, skipped: false },
              ];
              
              const timeMap: Record<string, string> = {
                Morning: "8:00 AM",
                Afternoon: "1:00 PM",
                Night: "9:00 PM"
              };
              const iconMap: Record<string, string> = {
                Morning: "Sun",
                Afternoon: "Sunset",
                Night: "Moon"
              };
              
              const selectedTimeKey = times[0] || "Morning";
              
              const newMed = {
                id: Date.now().toString(),
                name: pending.name,
                dose: pending.dose || "1 tablet",
                time: timeMap[selectedTimeKey],
                icon: iconMap[selectedTimeKey] || "Pill",
                color: selectedTimeKey === "Afternoon" ? "secondary" : "primary",
                to: "", 
                taken: false,
                skipped: false
              };
              
              currentMeds.push(newMed);
              localStorage.setItem('medicines', JSON.stringify(currentMeds));
              localStorage.removeItem('pending_medicine');
            } catch (e) {
              console.error(e);
            }
          }
          toast.success("Schedule saved"); 
          navigate({ to: "/medicine-overview" }); 
        }}>Save Schedule</PrimaryButton>
      </div>
    </Screen>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, Heart, Droplet, Activity, Footprints, Search, Calendar, Pill, Stethoscope, Sparkles, ChevronRight } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { Card, StatChip } from "@/components/mobile/Card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getApiUrl } from "@/utils/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — MediCare AI" }] }),
  component: Page,
});

const defaultMeds = [
  { id: "1", name: "Metformin", dose: "500mg", time: "8:00 AM", icon: "Sun", color: "primary", to: "/medicine/morning", taken: false, skipped: false },
  { id: "2", name: "Vitamin D3", dose: "1000 IU", time: "1:00 PM", icon: "Pill", color: "secondary", to: "/medicine/schedule", taken: false, skipped: false },
  { id: "3", name: "Atorvastatin", dose: "10mg", time: "9:00 PM", icon: "Moon", color: "primary", to: "/medicine/night", taken: false, skipped: false },
];

function Page() {
  console.log("Forcing Vercel rebuild");
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [medicines, setMedicines] = useState<any[]>([]);

  useEffect(() => {
    const demoName = localStorage.getItem('demo_name');
    const demoEmail = localStorage.getItem('demo_email');
    if (demoName) setUserName(demoName);
    else if (demoEmail) {
      const emailName = demoEmail.split('@')[0];
      setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
    }

    const loadMeds = async (userId?: string) => {
      if (userId) {
        try {
          const res = await fetch(getApiUrl(`/api/medicines?user_id=${userId}`));
          if (res.ok) {
            const data = await res.json();
            setMedicines(data);
            localStorage.setItem('medicines', JSON.stringify(data));
            return;
          }
        } catch (err) {
          console.error("Failed to load medicines from backend API:", err);
        }
      }

      // Fallback to localStorage
      const saved = localStorage.getItem('medicines');
      if (saved) {
        try {
          setMedicines(JSON.parse(saved));
        } catch (e) {
          setMedicines(defaultMeds);
        }
      } else {
        setMedicines(defaultMeds);
        localStorage.setItem('medicines', JSON.stringify(defaultMeds));
      }
    };

    supabase.auth.getUser().then(({ data }: any) => {
      if (data?.user) {
        if (data.user.user_metadata?.name) {
          setUserName(data.user.user_metadata.name);
        } else if (data.user.email) {
          const emailName = data.user.email.split('@')[0];
          setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
        }
        loadMeds(data.user.id);
      } else {
        loadMeds();
      }
    });
  }, []);

  return (
    <Screen
      noHeader
      bottomNav
      bgClass="bg-muted"
      contentClass="pb-6"
    >
      <div className="px-5 pt-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Good morning</p>
            <h1 className="text-xl font-bold text-foreground">{userName}</h1>
          </div>
          <Link to="/notifications" className="relative flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-[var(--shadow-soft)]">
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-destructive" />
          </Link>
        </div>

        <Link to="/chat" className="mt-5 flex h-12 items-center gap-3 rounded-2xl bg-card px-4 shadow-[var(--shadow-soft)]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Search symptoms, ask Aura AI...</span>
        </Link>

        <button
          onClick={() => navigate({ to: "/ai-recommendation" })}
          className="mt-5 flex w-full items-center gap-4 rounded-3xl p-5 text-left text-primary-foreground shadow-[var(--shadow-float)]"
          style={{ background: "var(--gradient-primary)" }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-xs opacity-90">AI Health Coach</p>
            <p className="text-sm font-semibold">Get today's personalized plan</p>
          </div>
          <ChevronRight className="h-5 w-5 opacity-80" />
        </button>

        <h2 className="mt-7 text-sm font-semibold text-foreground">Today's overview</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <StatChip icon={<Heart className="h-5 w-5" />} label="Heart rate" value="72 bpm" />
          <StatChip icon={<Droplet className="h-5 w-5" />} label="Blood sugar" value="98 mg/dL" tone="secondary" />
          <StatChip icon={<Activity className="h-5 w-5" />} label="Blood pressure" value="120/80" tone="success" />
          <StatChip icon={<Footprints className="h-5 w-5" />} label="Steps" value="6,420" tone="warning" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <ActionCard to="/diseases" icon={<Stethoscope className="h-5 w-5" />} title="My Conditions" sub="Manage diseases" />
          <ActionCard to="/medicine-overview" icon={<Pill className="h-5 w-5" />} title="Medicines" sub={`${medicines.length} today`} />
          <ActionCard to="/chat" icon={<Sparkles className="h-5 w-5" />} title="AI Chatbot" sub="Ask Aura health tips" />
          <ActionCard to="/calendar" icon={<Calendar className="h-5 w-5" />} title="Calendar" sub="View schedule" />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Upcoming reminders</h2>
          <Link to="/medicine-overview" className="text-xs font-medium text-primary">See all</Link>
        </div>
        <div className="mt-3 space-y-3">
          {medicines.filter(m => !m.taken && !m.skipped).slice(0, 3).map((m) => (
            <Link key={m.id} to="/medicine-overview" className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${m.color === "primary" ? "bg-primary-soft text-primary" : "bg-secondary-soft text-secondary"}`}>
                <Pill className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{m.name} <span className="font-normal text-muted-foreground">· {m.dose}</span></p>
                <p className="text-xs text-muted-foreground">1 tablet after meal</p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{m.time}</span>
            </Link>
          ))}
          {medicines.filter(m => !m.taken && !m.skipped).length === 0 && (
            <div className="text-center py-6 rounded-2xl bg-card border border-dashed border-muted">
              <p className="text-xs text-muted-foreground">All done for today! 🎉</p>
            </div>
          )}
        </div>

        <Link to="/medical-history" className="mt-5 flex items-center justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <div>
            <p className="text-sm font-semibold text-foreground">Medical history</p>
            <p className="text-xs text-muted-foreground">View past records & visits</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>
        <Link to="/daily-summary" className="mt-3 flex items-center justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <div>
            <p className="text-sm font-semibold text-foreground">Daily summary</p>
            <p className="text-xs text-muted-foreground">Review yesterday's progress</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>
      </div>
    </Screen>
  );
}

function ActionCard({ to, icon, title, sub }: { to: string; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <Link to={to} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">{icon}</div>
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </Link>
  );
}
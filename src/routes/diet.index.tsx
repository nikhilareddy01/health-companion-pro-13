import { createFileRoute, Link } from "@tanstack/react-router";
import { Apple, Coffee, Salad, UtensilsCrossed, Ban, AlertTriangle, Droplet, Sparkles } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";

export const Route = createFileRoute("/diet/")({ component: Page });

function Page() {
  return (
    <Screen noHeader bottomNav contentClass="px-5 pb-6">
      <div className="pt-4">
        <p className="text-xs text-muted-foreground">Diet & nutrition</p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Today's diet plan</h1>
      </div>
      <Link to="/diet/meal-plan" className="mt-5 block rounded-3xl p-5 text-primary-foreground shadow-[var(--shadow-float)]" style={{ background: "var(--gradient-primary)" }}>
        <Sparkles className="h-6 w-6" />
        <p className="mt-3 text-xs opacity-90">AI MEAL PLAN</p>
        <p className="text-lg font-bold">Diabetes-friendly · 1,800 kcal</p>
        <p className="mt-1 text-xs opacity-90">Personalized for your conditions</p>
      </Link>

      <h2 className="mt-6 text-sm font-semibold text-foreground">Meals today</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <MealCard to="/diet/breakfast" Icon={Coffee} title="Breakfast" sub="Oats & berries" tone="warning" />
        <MealCard to="/diet/lunch" Icon={Salad} title="Lunch" sub="Chicken bowl" tone="success" />
        <MealCard to="/diet/dinner" Icon={UtensilsCrossed} title="Dinner" sub="Lentil soup" tone="primary" />
        <MealCard to="/diet/water" Icon={Droplet} title="Hydration" sub="1.6 / 2.5 L" tone="secondary" />
      </div>

      <h2 className="mt-6 text-sm font-semibold text-foreground">Smart guidance</h2>
      <div className="mt-3 space-y-2">
        <Row Icon={Ban} to="/diet/avoid" t="Foods to avoid" s="Based on your conditions" />
        <Row Icon={AlertTriangle} to="/diet/trigger" t="Trigger food alerts" s="3 items flagged this week" />
        <Row Icon={Apple} to="/diet/nutrition" t="Nutrition analysis" s="Macros & micros breakdown" />
        <Row Icon={Sparkles} to="/diet/lifestyle" t="Lifestyle tips" s="Habits for better outcomes" />
      </div>
    </Screen>
  );
}

function MealCard({ to, Icon, title, sub, tone }: { to: string; Icon: any; title: string; sub: string; tone: "primary" | "secondary" | "success" | "warning" }) {
  const tones: Record<string, string> = { primary: "bg-primary-soft text-primary", secondary: "bg-secondary-soft text-secondary", success: "bg-success/15 text-success", warning: "bg-[oklch(0.96_0.05_75)] text-[oklch(0.55_0.12_75)]" };
  return (
    <Link to={to} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-5 w-5" /></div>
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </Link>
  );
}

function Row({ Icon, to, t, s }: { Icon: any; to: string; t: string; s: string }) {
  return (
    <Link to={to} className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon className="h-5 w-5" /></div>
      <div className="flex-1"><p className="text-sm font-semibold text-foreground">{t}</p><p className="text-xs text-muted-foreground">{s}</p></div>
    </Link>
  );
}

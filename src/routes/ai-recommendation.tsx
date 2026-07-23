import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Pill, Apple, Moon, Droplet, AlertTriangle, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { Card } from "@/components/mobile/Card";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getApiUrl } from "@/utils/api";

export const Route = createFileRoute("/ai-recommendation")({ component: Page });

interface RecommendationData {
  recommendation: string;
  lifestyleTips: string[];
  dietPlan: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  warnings: string[];
}

function Page() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RecommendationData | null>(null);
  const [mealPlanExpanded, setMealPlanExpanded] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      // Retrieve current medicines from local storage to feed the prompt
      const currentMedsStr = localStorage.getItem("medicines");
      const currentMeds = currentMedsStr
        ? JSON.parse(currentMedsStr)
        : [
            { id: "1", name: "Metformin", dose: "500mg", time: "8:00 AM", icon: "Sun", color: "primary", taken: false, skipped: false },
            { id: "2", name: "Vitamin D3", dose: "1000 IU", time: "1:00 PM", icon: "Pill", color: "secondary", taken: false, skipped: false },
            { id: "3", name: "Atorvastatin", dose: "10mg", time: "9:00 PM", icon: "Moon", color: "primary", taken: false, skipped: false },
          ];

      const profileDetails = {
        age: "34 years",
        weight: "68 kg",
        height: "172 cm",
        bloodPressure: "120 / 80 mmHg",
        bloodSugar: "98 mg/dL",
        medicalNotes: "Type 2 diabetes since 2022. Mild hypertension. Family history of cardiac disease. No known drug allergies.",
      };

      const goals = [
        "Weight Management: Reach 65 kg",
        "Daily Health: 8,000 steps · 30 min activity",
        "Diet: 1,800 kcal · low GI meals",
      ];

      try {
        const response = await fetch(getApiUrl("/api/ai/health-recommendations"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileDetails, medicines: currentMeds, goals }),
        });

        if (!response.ok) {
          throw new Error("Failed to load recommendations");
        }

        const result = await response.json();
        setData(result);
      } catch (e: any) {
        console.error(e);
        toast.error("Could not fetch fresh AI advice. Using cached local copy.");
        // Cached fallback so the screen is always functional
        setData({
          recommendation: "Your blood sugar trend is stable. Keep a low-glycemic breakfast and a 20-minute walk after meals today to maintain optimal levels.",
          lifestyleTips: [
            "Take a 15-20 minute brisk walk after your main meals to improve insulin sensitivity.",
            "Keep a consistent sleep schedule to support hormonal balance.",
            "Set water reminders to ensure you drink at least 2.5L throughout the day.",
          ],
          dietPlan: {
            breakfast: "Oats with chia seeds, handful of berries, and unsweetened almond milk.",
            lunch: "Grilled chicken or tofu salad with mixed greens, olive oil dressing, and quinoa.",
            dinner: "Lentil soup or baked salmon served with steamed broccoli and brown rice.",
          },
          warnings: [
            "Monitor for any dizziness or fatigue if you start new medications.",
            "Avoid skipping meals while on Metformin to prevent potential hypoglycemia.",
            "Keep sugar tablets or fruit juice nearby in case of sudden drops in blood sugar.",
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <Screen title="AI Recommendations" contentClass="px-5 pb-8 space-y-4">
      {loading ? (
        <div className="space-y-4 animate-pulse pt-2">
          {/* Skeleton for main summary card */}
          <div className="h-32 rounded-3xl bg-muted" />
          {/* Skeleton for warnings alert */}
          <div className="h-14 rounded-2xl bg-muted" />
          {/* Skeleton for standard links list */}
          <div className="space-y-3">
            <div className="h-20 rounded-2xl bg-muted" />
            <div className="h-20 rounded-2xl bg-muted" />
            <div className="h-20 rounded-2xl bg-muted" />
            <div className="h-20 rounded-2xl bg-muted" />
          </div>
        </div>
      ) : (
        data && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* 1. Main Recommendation Banner */}
            <div className="rounded-3xl p-5 text-primary-foreground shadow-[var(--shadow-float)]" style={{ background: "var(--gradient-primary)" }}>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span className="text-xs font-medium opacity-90">Personalized Health Advice</span>
              </div>
              <p className="text-base font-semibold leading-snug">{data.recommendation}</p>
            </div>

            {/* 2. Critical Safety Warnings Section (if present) */}
            {data.warnings && data.warnings.length > 0 && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 flex gap-3 items-start">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-destructive">AI SAFETY ALERTS & WARNINGS</p>
                  <ul className="list-disc pl-4 text-xs text-foreground/80 space-y-1">
                    {data.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 3. Interactive Collapsible Diet Recommendation Card */}
            <Card className="p-0 overflow-hidden">
              <button 
                onClick={() => setMealPlanExpanded(!mealPlanExpanded)}
                className="w-full flex items-center justify-between p-4 bg-card cursor-pointer hover:bg-muted/10 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Apple className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">Diet recommendation today</p>
                    <p className="text-xs text-muted-foreground">Click to view personalized meals</p>
                  </div>
                </div>
                {mealPlanExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>
              
              {mealPlanExpanded && (
                <div className="px-4 pb-4 border-t border-border/40 bg-muted/10 space-y-3 pt-3 animate-in slide-in-from-top duration-200">
                  <div className="space-y-2">
                    <div className="rounded-xl bg-card p-3 shadow-[var(--shadow-soft)]">
                      <p className="text-[10px] font-bold text-primary">BREAKFAST</p>
                      <p className="text-xs font-medium text-foreground mt-0.5">{data.dietPlan.breakfast}</p>
                    </div>
                    <div className="rounded-xl bg-card p-3 shadow-[var(--shadow-soft)]">
                      <p className="text-[10px] font-bold text-secondary">LUNCH</p>
                      <p className="text-xs font-medium text-foreground mt-0.5">{data.dietPlan.lunch}</p>
                    </div>
                    <div className="rounded-xl bg-card p-3 shadow-[var(--shadow-soft)]">
                      <p className="text-[10px] font-bold text-accent" style={{ color: "oklch(0.55_0.12_75)" }}>DINNER</p>
                      <p className="text-xs font-medium text-foreground mt-0.5">{data.dietPlan.dinner}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Link to="/diet/meal-plan" className="text-xs font-semibold text-primary hover:underline">
                      View full calorie & nutrition goals →
                    </Link>
                  </div>
                </div>
              )}
            </Card>

            {/* 4. Personalized Lifestyle Suggestions Card */}
            {data.lifestyleTips && data.lifestyleTips.length > 0 && (
              <Card className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <p className="text-xs font-bold text-foreground">LIFESTYLE & ACTIVITY TIPS</p>
                </div>
                <div className="space-y-2">
                  {data.lifestyleTips.map((tip, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary-soft text-[10px] font-bold text-secondary">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{tip}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 5. Standard Route Links */}
            <div className="pt-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Additional trackers</div>
            {[
              { Icon: Pill, title: "Medications schedule", text: "Log taken and skipped doses", to: "/medicine-overview" },
              { Icon: Moon, title: "Sleep analysis", text: "Track deep sleep and wind down times", to: "/progress/sleep" },
              { Icon: Droplet, title: "Hydration tracking", text: "Log water intake and target details", to: "/diet/water" },
            ].map((c) => (
              <Link key={c.title} to={c.to} className="block">
                <Card className="flex items-start gap-4 hover:scale-[1.01] hover:bg-muted/10 transition duration-200 cursor-pointer">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <c.Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{c.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{c.text}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )
      )}
    </Screen>
  );
}

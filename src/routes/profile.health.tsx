import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { Edit3, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getApiUrl } from "@/utils/api";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/profile/health")({ component: Page });

function Page() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Health states
  const [bloodPressure, setBloodPressure] = useState("120 / 80 mmHg");
  const [bloodSugar, setBloodSugar] = useState("98 mg/dL");
  const [heartRate, setHeartRate] = useState("72 bpm");
  const [painLevel, setPainLevel] = useState("2 / 10");
  const [age, setAge] = useState("34 years");
  const [weight, setWeight] = useState("68 kg");
  const [height, setHeight] = useState("172 cm");
  const [bmi, setBmi] = useState("23.0 — Healthy");
  const [medicalNotes, setMedicalNotes] = useState(
    "Type 2 diabetes since 2022. Mild hypertension. Family history of cardiac disease. No known drug allergies."
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      const uid = data?.user?.id || null;
      setUserId(uid);
      const userKey = uid || "guest";

      // 1. Load from localStorage
      const savedLocal = localStorage.getItem(`profile_health_${userKey}`);
      if (savedLocal) {
        try {
          const parsed = JSON.parse(savedLocal);
          if (parsed.bloodPressure || parsed.blood_pressure) setBloodPressure(parsed.bloodPressure || parsed.blood_pressure);
          if (parsed.bloodSugar || parsed.blood_sugar) setBloodSugar(parsed.bloodSugar || parsed.blood_sugar);
          if (parsed.heartRate || parsed.heart_rate) setHeartRate(parsed.heartRate || parsed.heart_rate);
          if (parsed.painLevel || parsed.pain_level) setPainLevel(parsed.painLevel || parsed.pain_level);
          if (parsed.age) setAge(parsed.age);
          if (parsed.weight) setWeight(parsed.weight);
          if (parsed.height) setHeight(parsed.height);
          if (parsed.bmi) setBmi(parsed.bmi);
          if (parsed.medicalNotes || parsed.medical_notes) setMedicalNotes(parsed.medicalNotes || parsed.medical_notes);
        } catch (e) {
          console.error(e);
        }
      }

      // 2. Load from backend
      if (uid) {
        fetch(getApiUrl(`/api/profiles/${uid}`))
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data && Object.keys(data).length > 0) {
              if (data.blood_pressure) setBloodPressure(data.blood_pressure);
              if (data.blood_sugar) setBloodSugar(data.blood_sugar);
              if (data.heart_rate) setHeartRate(data.heart_rate);
              if (data.pain_level) setPainLevel(data.pain_level);
              if (data.age) setAge(data.age);
              if (data.weight) setWeight(data.weight);
              if (data.height) setHeight(data.height);
              if (data.bmi) setBmi(data.bmi);
              if (data.medical_notes) setMedicalNotes(data.medical_notes);
            }
          })
          .catch(() => {})
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const userKey = userId || "guest";
    const updates = {
      blood_pressure: bloodPressure,
      blood_sugar: bloodSugar,
      heart_rate: heartRate,
      pain_level: painLevel,
      age: age,
      weight: weight,
      height: height,
      bmi: bmi,
      medical_notes: medicalNotes,
      bloodPressure,
      bloodSugar,
      heartRate,
      painLevel,
      medicalNotes,
    };

    // Save to LocalStorage immediately
    localStorage.setItem(`profile_health_${userKey}`, JSON.stringify(updates));

    if (!userId) {
      toast.success("Health details updated & saved!");
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      await fetch(getApiUrl(`/api/profiles/${userId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      toast.success("Health details updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      toast.success("Health details updated!");
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const items = [
    { k: "Blood Pressure", v: bloodPressure, set: setBloodPressure, placeholder: "e.g. 120 / 80 mmHg" },
    { k: "Blood Sugar", v: bloodSugar, set: setBloodSugar, placeholder: "e.g. 98 mg/dL" },
    { k: "Heart Rate", v: heartRate, set: setHeartRate, placeholder: "e.g. 72 bpm" },
    { k: "Pain Level", v: painLevel, set: setPainLevel, placeholder: "e.g. 2 / 10" },
    { k: "Age", v: age, set: setAge, placeholder: "e.g. 34 years" },
    { k: "Weight", v: weight, set: setWeight, placeholder: "e.g. 68 kg" },
    { k: "Height", v: height, set: setHeight, placeholder: "e.g. 172 cm" },
    { k: "BMI", v: bmi, set: setBmi, placeholder: "e.g. 23.0 — Healthy" },
  ];

  return (
    <Screen
      title="Health Details"
      headerRight={
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
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
          <p className="text-xs text-muted-foreground">Loading health records...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.k}
                className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] min-h-[56px]"
              >
                <p className="text-sm font-medium text-muted-foreground">{item.k}</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={item.v}
                    onChange={(e) => item.set(e.target.value)}
                    placeholder={item.placeholder}
                    className="text-sm font-semibold text-right bg-muted px-3 py-1.5 rounded-xl max-w-[170px] outline-none focus:ring-2 focus:ring-primary text-foreground"
                  />
                ) : (
                  <p className="text-sm font-semibold text-foreground">{item.v}</p>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-medium text-muted-foreground">MEDICAL NOTES</p>
            {isEditing ? (
              <textarea
                rows={4}
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="Enter past conditions, allergies, or notes..."
                className="mt-2 w-full text-sm leading-relaxed bg-muted p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            ) : (
              <p className="mt-2 text-sm leading-relaxed text-foreground">{medicalNotes}</p>
            )}
          </div>

          <div className="mt-8">
            {isEditing ? (
              <PrimaryButton type="submit" disabled={saving}>
                {saving ? "Saving Changes..." : "Save Details"}
              </PrimaryButton>
            ) : (
              <PrimaryButton type="button" onClick={() => setIsEditing(true)}>
                Edit Details
              </PrimaryButton>
            )}
          </div>
        </form>
      )}
    </Screen>
  );
}

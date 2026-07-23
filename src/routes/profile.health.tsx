import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { Edit3, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getApiUrl } from "@/utils/api";

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
  const [medicalNotes, setMedicalNotes] = useState("Type 2 diabetes since 2022. Mild hypertension. Family history of cardiac disease. No known drug allergies.");

  useEffect(() => {
    const loadProfile = async (uid: string) => {
      try {
        const res = await fetch(getApiUrl(`/api/profiles/${uid}`));
        if (res.ok) {
          const data = await res.json();
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
        }
      } catch (err) {
        console.error("Failed to load profile details:", err);
      } finally {
        setLoading(false);
      }
    };

    import("@/integrations/supabase/client").then(({ supabase }) => {
      supabase.auth.getUser().then(({ data }: { data: any }) => {
        if (data?.user) {
          setUserId(data.user.id);
          loadProfile(data.user.id);
        } else {
          setLoading(false);
        }
      });
    });
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userId) {
      toast.success("Details saved locally (guest mode)");
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      const updates = {
        blood_pressure: bloodPressure,
        blood_sugar: bloodSugar,
        heart_rate: heartRate,
        pain_level: painLevel,
        age: age,
        weight: weight,
        height: height,
        bmi: bmi,
        medical_notes: medicalNotes
      };

      const res = await fetch(getApiUrl(`/api/profiles/${userId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Failed to save details");
      toast.success("Health details updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Could not save details to server");
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
          <p className="text-xs text-muted-foreground">Loading health records...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.k} className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] min-h-[56px]">
                <p className="text-sm text-muted-foreground">{item.k}</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={item.v}
                    onChange={(e) => item.set(e.target.value)}
                    placeholder={item.placeholder}
                    className="text-sm font-semibold text-right bg-muted px-2 py-1 rounded-md max-w-[150px] outline-none focus:ring-1 focus:ring-primary text-foreground"
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
                className="mt-2 w-full text-sm leading-relaxed bg-muted p-2 rounded-xl border-none outline-none focus:ring-1 focus:ring-primary text-foreground"
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

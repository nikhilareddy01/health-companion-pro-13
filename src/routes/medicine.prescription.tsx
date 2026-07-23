import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, Upload, FileText, X, Loader2, Check, Pill, RefreshCw } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { getApiUrl } from "@/utils/api";

export const Route = createFileRoute("/medicine/prescription")({ component: Page });

interface ParsedMedicine {
  name: string;
  dose: string;
  time: "Morning" | "Afternoon" | "Night" | string;
  instructions: string;
  selected?: boolean;
}

function Page() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [parsedMedicines, setParsedMedicines] = useState<ParsedMedicine[] | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      toast.success("Prescription image loaded");
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const processPrescription = async () => {
    if (!image) {
      toast.error("Please select or capture a prescription image first");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(getApiUrl("/api/ai/parse-prescription"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, mimeType }),
      });

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      const data = await response.json();
      if (data.medicines && Array.isArray(data.medicines)) {
        const meds = data.medicines.map((m: any) => ({ ...m, selected: true }));
        setParsedMedicines(meds);
        toast.success("AI successfully parsed prescription!");
      } else {
        throw new Error("No medicines detected");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Error analyzing prescription. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectMedicine = (index: number) => {
    if (!parsedMedicines) return;
    const updated = [...parsedMedicines];
    updated[index].selected = !updated[index].selected;
    setParsedMedicines(updated);
  };

  const saveToSchedule = () => {
    if (!parsedMedicines) return;
    const selectedMeds = parsedMedicines.filter((m) => m.selected);
    if (selectedMeds.length === 0) {
      toast.error("Please select at least one medicine to add");
      return;
    }

    const currentMedsStr = localStorage.getItem("medicines");
    const currentMeds = currentMedsStr
      ? JSON.parse(currentMedsStr)
      : [
          { id: "1", name: "Metformin", dose: "500mg", time: "8:00 AM", icon: "Sun", color: "primary", to: "/medicine/morning", taken: false, skipped: false },
          { id: "2", name: "Vitamin D3", dose: "1000 IU", time: "1:00 PM", icon: "Pill", color: "secondary", to: "/medicine/schedule", taken: false, skipped: false },
          { id: "3", name: "Atorvastatin", dose: "10mg", time: "9:00 PM", icon: "Moon", color: "primary", to: "/medicine/night", taken: false, skipped: false },
        ];

    const timeMap: Record<string, string> = {
      Morning: "8:00 AM",
      Afternoon: "1:00 PM",
      Night: "9:00 PM",
    };
    const iconMap: Record<string, string> = {
      Morning: "Sun",
      Afternoon: "Sunset",
      Night: "Moon",
    };

    const newItems = selectedMeds.map((m) => {
      const standardTimeKey = ["Morning", "Afternoon", "Night"].includes(m.time) ? m.time : "Morning";
      return {
        id: (Date.now() + Math.random() * 1000).toString(),
        name: m.name,
        dose: m.dose || "1 tablet",
        time: timeMap[standardTimeKey] || m.time,
        icon: iconMap[standardTimeKey] || "Pill",
        color: standardTimeKey === "Afternoon" ? "secondary" : "primary",
        to: "",
        taken: false,
        skipped: false,
        instructions: m.instructions
      };
    });

    const updatedMeds = [...currentMeds, ...newItems];
    localStorage.setItem("medicines", JSON.stringify(updatedMeds));
    toast.success(`${newItems.length} medicine(s) successfully scheduled!`);
    navigate({ to: "/medicine-overview" });
  };

  const resetScanner = () => {
    setImage(null);
    setMimeType("");
    setParsedMedicines(null);
  };

  return (
    <Screen title="Upload Prescription" contentClass="px-5 pb-8 relative min-h-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-card shadow-[var(--shadow-float)]">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
          <p className="mt-5 text-sm font-semibold text-foreground">AI is parsing your prescription...</p>
          <p className="mt-1 text-xs text-muted-foreground">Extracting dosage and frequency schedules</p>
        </div>
      )}

      {!image && !parsedMedicines && (
        <>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Snap or upload your prescription. Our Gemini-powered AI will automatically read and extract details, saving you from manual entry.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              onClick={triggerUpload}
              className="rounded-2xl border border-dashed border-border bg-card p-6 text-center shadow-[var(--shadow-soft)] hover:bg-muted/50 transition cursor-pointer"
            >
              <Camera className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-3 text-sm font-semibold text-foreground">Take photo</p>
            </button>
            <button
              onClick={triggerUpload}
              className="rounded-2xl border border-dashed border-border bg-card p-6 text-center shadow-[var(--shadow-soft)] hover:bg-muted/50 transition cursor-pointer"
            >
              <Upload className="mx-auto h-8 w-8 text-secondary" />
              <p className="mt-3 text-sm font-semibold text-foreground">Upload file</p>
            </button>
          </div>
          <p className="mt-7 text-xs font-semibold text-muted-foreground">RECENT PRESCRIPTIONS</p>
          <div className="mt-3 space-y-2">
            {["Apr 22 — Dr. Sarah Lin", "Jan 15 — Dr. Adams"].map((p) => (
              <div key={p} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
                <FileText className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-foreground">{p}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {image && !parsedMedicines && (
        <div className="space-y-5 animate-in fade-in zoom-in duration-300">
          <p className="text-sm text-muted-foreground">Verify the prescription image below before sending it to AI for analysis:</p>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-black shadow-[var(--shadow-float)] max-h-64 flex items-center justify-center">
            <img src={image} alt="Prescription preview" className="object-contain max-h-64 w-full" />
            <button
              onClick={resetScanner}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 backdrop-blur text-foreground shadow-[var(--shadow-soft)] hover:bg-card hover:scale-105 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-3 mt-4">
            <PrimaryButton className="flex-1" onClick={processPrescription}>
              Analyze with Gemini
            </PrimaryButton>
          </div>
        </div>
      )}

      {parsedMedicines && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Review Extracted Medications</p>
              <p className="text-xs text-muted-foreground">Select the ones you want to add to your daily list</p>
            </div>
            <button
              onClick={resetScanner}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:opacity-80 transition"
            >
              <RefreshCw className="h-3 w-3" /> Rescan
            </button>
          </div>

          <div className="space-y-3">
            {parsedMedicines.map((m, idx) => (
              <div
                key={idx}
                onClick={() => toggleSelectMedicine(idx)}
                className={`group flex items-start gap-4 rounded-2xl border p-4 shadow-[var(--shadow-soft)] transition cursor-pointer ${
                  m.selected
                    ? "border-primary bg-primary-soft/50"
                    : "border-border bg-card hover:bg-muted/30"
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                    m.selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 bg-background"
                  }`}
                >
                  {m.selected && <Check className="h-3.5 w-3.5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Pill className="h-3.5 w-3.5 text-primary shrink-0" />
                    <p className="text-sm font-bold text-foreground truncate">{m.name}</p>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs">
                    <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground">{m.dose}</span>
                    <span className="rounded bg-primary-soft px-1.5 py-0.5 text-primary font-medium">{m.time}</span>
                  </div>
                  {m.instructions && (
                    <p className="mt-2 text-xs italic text-muted-foreground leading-relaxed">
                      "{m.instructions}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <PrimaryButton onClick={saveToSchedule}>
              Confirm & Save to Schedule ({parsedMedicines.filter((m) => m.selected).length})
            </PrimaryButton>
            <button
              onClick={resetScanner}
              className="w-full py-3 text-center text-sm font-semibold text-muted-foreground hover:text-foreground transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Screen>
  );
}

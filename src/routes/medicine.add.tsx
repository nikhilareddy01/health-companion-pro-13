import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Pill } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { toast } from "sonner";

export const Route = createFileRoute("/medicine/add")({ component: Page });

function Page() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [type, setType] = useState("Tablet");
  return (
    <Screen title="Add Medicine" contentClass="px-5 pb-8">
      <div className="mb-5 flex items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-soft">
          <Pill className="h-9 w-9 text-primary" />
        </div>
      </div>
      <form onSubmit={(e) => { 
        e.preventDefault(); 
        if (!name.trim()) {
          toast.error("Please enter a medicine name");
          return;
        }
        localStorage.setItem('pending_medicine', JSON.stringify({ name, dose, type }));
        navigate({ to: "/medicine/schedule" }); 
      }} className="space-y-3">
        <Input label="Medicine name" value={name} onChange={setName} placeholder="e.g. Metformin" />
        <Input label="Dose" value={dose} onChange={setDose} placeholder="e.g. 500mg" />
        <div>
          <label className="mb-2 block text-xs font-medium text-muted-foreground">Type</label>
          <div className="grid grid-cols-4 gap-2">
            {["Tablet", "Capsule", "Syrup", "Drops"].map((t) => (
              <button type="button" key={t} onClick={() => setType(t)} className={`h-11 rounded-xl text-xs font-medium transition ${type === t ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="pt-6">
          <PrimaryButton type="submit">Next: Set Schedule</PrimaryButton>
        </div>
      </form>
    </Screen>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (s: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-muted-foreground">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-12 w-full rounded-2xl bg-muted px-4 text-sm outline-none focus:ring-2 focus:ring-primary" />
    </div>
  );
}

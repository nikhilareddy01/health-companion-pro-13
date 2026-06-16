import { createFileRoute } from "@tanstack/react-router";
import { Camera, Upload, FileText } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { toast } from "sonner";

export const Route = createFileRoute("/medicine/prescription")({ component: Page });

function Page() {
  return (
    <Screen title="Upload Prescription" contentClass="px-5 pb-8">
      <p className="text-sm text-muted-foreground">Snap or upload your prescription. Our AI will parse medicines and set reminders for you.</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button onClick={() => toast.success("Camera opened")} className="rounded-2xl bg-card p-6 text-center shadow-[var(--shadow-soft)]">
          <Camera className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3 text-sm font-semibold text-foreground">Take photo</p>
        </button>
        <button onClick={() => toast.success("Choose file")} className="rounded-2xl bg-card p-6 text-center shadow-[var(--shadow-soft)]">
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
      <div className="mt-8"><PrimaryButton>Process Prescription</PrimaryButton></div>
    </Screen>
  );
}

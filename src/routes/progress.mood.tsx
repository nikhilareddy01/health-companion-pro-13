import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { toast } from "sonner";

export const Route = createFileRoute("/progress/mood")({ component: Page });

const moods = [{ e: "😢", t: "Awful" }, { e: "😟", t: "Low" }, { e: "😐", t: "Okay" }, { e: "🙂", t: "Good" }, { e: "😄", t: "Great" }];

function Page() {
  const [sel, setSel] = useState(3);
  return (
    <Screen title="Mood Tracker" contentClass="px-5 pb-8">
      <p className="text-sm text-muted-foreground">How are you feeling right now?</p>
      <div className="mt-6 grid grid-cols-5 gap-2">
        {moods.map((m, i) => (
          <button key={i} onClick={() => setSel(i)} className={`rounded-2xl p-3 text-center transition ${sel === i ? "bg-primary text-primary-foreground" : "bg-card"} shadow-[var(--shadow-soft)]`}>
            <div className="text-3xl">{m.e}</div>
            <p className="mt-1 text-[11px] font-medium">{m.t}</p>
          </button>
        ))}
      </div>
      <div className="mt-7">
        <textarea placeholder="Add a note about today…" className="h-28 w-full resize-none rounded-2xl bg-muted p-4 text-sm outline-none" />
      </div>
      <div className="mt-6"><PrimaryButton onClick={() => toast.success("Mood saved")}>Save Mood</PrimaryButton></div>
    </Screen>
  );
}

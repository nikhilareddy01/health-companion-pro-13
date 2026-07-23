import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/progress/mood")({ component: Page });

const moods = [
  { e: "😢", t: "Awful" },
  { e: "😟", t: "Low" },
  { e: "😐", t: "Okay" },
  { e: "🙂", t: "Good" },
  { e: "😄", t: "Great" },
];

function Page() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [sel, setSel] = useState(4); // Default to Great
  const [note, setNote] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      const uid = data?.user?.id || null;
      setUserId(uid);
      const userKey = uid || "guest";
      const saved = localStorage.getItem(`mood_${userKey}`);
      if (saved) {
        const foundIndex = moods.findIndex((m) => saved.includes(m.t));
        if (foundIndex !== -1) setSel(foundIndex);
      }
      const savedNote = localStorage.getItem(`mood_note_${userKey}`);
      if (savedNote) setNote(savedNote);
    });
  }, []);

  const handleSave = () => {
    const selectedMood = `${moods[sel].t} ${moods[sel].e}`;
    const userKey = userId || "guest";
    localStorage.setItem(`mood_${userKey}`, selectedMood);
    if (note) localStorage.setItem(`mood_note_${userKey}`, note);

    toast.success(`Mood saved: ${selectedMood}`);
    navigate({ to: "/progress" });
  };

  return (
    <Screen title="Mood Tracker" contentClass="px-5 pb-8">
      <p className="text-sm text-muted-foreground">How are you feeling right now?</p>
      <div className="mt-6 grid grid-cols-5 gap-2">
        {moods.map((m, i) => (
          <button
            key={i}
            onClick={() => setSel(i)}
            className={`rounded-2xl p-3 text-center transition-all ${
              sel === i
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "bg-card hover:bg-muted text-foreground"
            } shadow-[var(--shadow-soft)]`}
          >
            <div className="text-3xl">{m.e}</div>
            <p className="mt-1 text-[11px] font-semibold">{m.t}</p>
          </button>
        ))}
      </div>
      <div className="mt-7">
        <textarea
          placeholder="Add a note about today…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="h-28 w-full resize-none rounded-2xl bg-muted p-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="mt-6">
        <PrimaryButton onClick={handleSave}>Save Mood</PrimaryButton>
      </div>
    </Screen>
  );
}

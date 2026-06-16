import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { Screen } from "@/components/mobile/Screen";

export const Route = createFileRoute("/search-symptoms")({ component: Page });

const symptoms = ["Headache", "Chest pain", "Dizziness", "Fatigue", "Fever", "Cough", "Nausea", "Joint pain", "Shortness of breath", "Skin rash"];

function Page() {
  const [q, setQ] = useState("");
  const filtered = symptoms.filter((s) => s.toLowerCase().includes(q.toLowerCase()));
  return (
    <Screen title="Search Symptoms" contentClass="px-5 pb-8">
      <div className="flex h-12 items-center gap-3 rounded-2xl bg-muted px-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a symptom…" className="w-full bg-transparent text-sm outline-none" />
      </div>
      <p className="mt-6 text-xs font-semibold text-muted-foreground">COMMON SYMPTOMS</p>
      <div className="mt-3 space-y-2">
        {filtered.map((s) => (
          <Link key={s} to="/progress/symptoms" className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
            <span className="text-sm font-medium text-foreground">{s}</span>
            <span className="text-xs text-primary">View insights</span>
          </Link>
        ))}
      </div>
    </Screen>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { FileText, Stethoscope, Syringe } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";

export const Route = createFileRoute("/medical-history")({ component: Page });

const records = [
  { Icon: Stethoscope, title: "Dr. Sarah Lin · Endocrinologist", date: "Apr 22, 2026", desc: "Quarterly diabetes check-up. HbA1c 6.4%." },
  { Icon: FileText, title: "Blood test report", date: "Apr 22, 2026", desc: "Lipid panel within normal range." },
  { Icon: Syringe, title: "Flu vaccination", date: "Oct 12, 2025", desc: "Seasonal influenza vaccine." },
  { Icon: Stethoscope, title: "Dr. Adams · GP", date: "Aug 03, 2025", desc: "Routine BP monitoring." },
];

function Page() {
  return (
    <Screen title="Medical History" contentClass="px-5 pb-8">
      <div className="space-y-3">
        {records.map((r, i) => (
          <div key={i} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><r.Icon className="h-5 w-5" /></div>
              <div>
                <p className="text-sm font-semibold text-foreground">{r.title}</p>
                <p className="text-[11px] text-muted-foreground">{r.date}</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{r.desc}</p>
          </div>
        ))}
      </div>
    </Screen>
  );
}

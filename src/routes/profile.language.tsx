import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { toast } from "sonner";

export const Route = createFileRoute("/profile/language")({ component: Page });

const langs = ["English", "Telugu", "Hindi", "Tamil"];

function Page() {
  const [sel, setSel] = useState("English");
  return (
    <Screen title="Language" contentClass="px-5 pb-8">
      <div className="space-y-2">{langs.map((l) => (
        <button key={l} onClick={() => setSel(l)} className={`flex w-full items-center justify-between rounded-2xl border p-4 transition ${sel === l ? "border-primary bg-primary-soft" : "border-border bg-card"}`}>
          <span className={`text-sm font-medium ${sel === l ? "text-primary" : "text-foreground"}`}>{l}</span>
          {sel === l && <Check className="h-4 w-4 text-primary" />}
        </button>
      ))}</div>
      <div className="mt-8"><PrimaryButton onClick={() => toast.success(`Language set to ${sel}`)}>Save</PrimaryButton></div>
    </Screen>
  );
}

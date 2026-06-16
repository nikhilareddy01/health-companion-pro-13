import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({ component: Page });

function Page() {
  const navigate = useNavigate();
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");

  return (
    <Screen noHeader bgClass="bg-background">
      <div className="px-7 pt-16">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Create a new strong password.</p>
        <form onSubmit={(e) => { e.preventDefault(); if (p1 !== p2) { toast.error("Passwords don't match"); return; } toast.success("Password reset"); navigate({ to: "/login" }); }} className="mt-8 flex flex-col gap-4">
          <Field icon={<Lock className="h-4 w-4" />} type="password" value={p1} onChange={setP1} placeholder="New password" />
          <Field icon={<Lock className="h-4 w-4" />} type="password" value={p2} onChange={setP2} placeholder="Confirm password" />
          <PrimaryButton type="submit" className="mt-4">Reset Password</PrimaryButton>
        </form>
      </div>
    </Screen>
  );
}

function Field({ icon, type, value, onChange, placeholder }: { icon: React.ReactNode; type: string; value: string; onChange: (s: string) => void; placeholder: string }) {
  return (
    <div className="flex h-14 items-center gap-3 rounded-2xl bg-muted px-4">
      <span className="text-muted-foreground">{icon}</span>
      <input type={type} required value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent text-sm outline-none" />
    </div>
  );
}

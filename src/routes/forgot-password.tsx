import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, KeyRound } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";

export const Route = createFileRoute("/forgot-password")({ component: Page });

function Page() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  return (
    <Screen noHeader bgClass="bg-background">
      <div className="px-7 pt-16">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-soft">
          <KeyRound className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Forgot Password?</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter your email and we'll send a verification code to reset your password.</p>
        <form onSubmit={(e) => { e.preventDefault(); navigate({ to: "/otp" }); }} className="mt-8 flex flex-col gap-4">
          <div className="flex h-14 items-center gap-3 rounded-2xl bg-muted px-4">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full bg-transparent text-sm outline-none" />
          </div>
          <PrimaryButton type="submit" className="mt-4">Send Code</PrimaryButton>
        </form>
      </div>
    </Screen>
  );
}

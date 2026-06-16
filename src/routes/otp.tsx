import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";

export const Route = createFileRoute("/otp")({ component: Page });

function Page() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(["", "", "", ""]);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const onChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 3) refs[i + 1].current?.focus();
  };

  return (
    <Screen noHeader bgClass="bg-background">
      <div className="px-7 pt-16">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Verification</h1>
        <p className="mt-2 text-sm text-muted-foreground">We sent a 4-digit code to your email. Enter it below.</p>
        <form onSubmit={(e) => { e.preventDefault(); navigate({ to: "/reset-password" }); }} className="mt-10">
          <div className="flex justify-between gap-3">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={refs[i]}
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => onChange(i, e.target.value)}
                className="h-16 w-16 rounded-2xl bg-muted text-center text-2xl font-bold text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">Didn't receive code? <button type="button" className="font-semibold text-primary">Resend</button></p>
          <div className="mt-10">
            <PrimaryButton type="submit">Verify</PrimaryButton>
          </div>
        </form>
      </div>
    </Screen>
  );
}

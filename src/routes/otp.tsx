import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/otp")({ component: Page });

function Page() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [targetEmail, setTargetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    const email = localStorage.getItem("reset_email") || "";
    setTargetEmail(email);
  }, []);

  const onChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 3) refs[i + 1].current?.focus();
  };

  const handleResend = async () => {
    if (!targetEmail) {
      toast.error("No target email address found. Please try again.");
      navigate({ to: "/forgot-password" });
      return;
    }
    toast.info(`Resending verification code to ${targetEmail}...`);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail);
      if (error) {
        toast.error(error.message || "Failed to resend code");
      } else {
        toast.success("New OTP verification code sent!");
      }
    } catch {
      toast.error("Network error. Could not resend code.");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = digits.join("");
    if (otpCode.length < 4) {
      toast.error("Please enter the complete 4-digit code");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: targetEmail,
        token: otpCode,
        type: "recovery",
      });

      if (error) {
        toast.error(error.message || "Invalid or expired OTP code.");
      } else {
        toast.success("OTP verified successfully!");
        navigate({ to: "/reset-password" });
      }
    } catch {
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen noHeader bgClass="bg-background">
      <div className="px-7 pt-16">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Verification Code</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a 4-digit code to <span className="font-semibold text-foreground">{targetEmail || "your email"}</span>. Enter it below.
        </p>
        <form onSubmit={handleVerify} className="mt-10">
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
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Didn't receive code?{" "}
            <button type="button" onClick={handleResend} className="font-semibold text-primary hover:underline">
              Resend Code
            </button>
          </p>
          <div className="mt-10">
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                </span>
              ) : (
                "Verify & Continue"
              )}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </Screen>
  );
}

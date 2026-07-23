import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, KeyRound, Loader2 } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({ component: Page });

function Page() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      localStorage.setItem("reset_email", email.trim());
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) {
        toast.error(error.message || "Failed to send reset code. Please try again.");
      } else {
        toast.success(`Verification OTP sent to ${email.trim()}!`);
        navigate({ to: "/otp" });
      }
    } catch (err: any) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen noHeader bgClass="bg-background">
      <div className="px-7 pt-16">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-soft">
          <KeyRound className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Forgot Password?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your registered email address and we will send an OTP verification code to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div className="flex h-14 items-center gap-3 rounded-2xl bg-muted px-4">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          <PrimaryButton type="submit" className="mt-4" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Sending Code...
              </span>
            ) : (
              "Send Code"
            )}
          </PrimaryButton>
        </form>
      </div>
    </Screen>
  );
}

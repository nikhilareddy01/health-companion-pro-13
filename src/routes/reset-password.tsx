import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({ component: Page });

function Page() {
  const navigate = useNavigate();
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (p1.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (p1 !== p2) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: p1 });
      if (error) {
        toast.error(error.message || "Failed to update password.");
      } else {
        toast.success("Password reset successfully! Please sign in with your new password.");
        navigate({ to: "/login" });
      }
    } catch {
      toast.error("An error occurred while resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen noHeader bgClass="bg-background">
      <div className="px-7 pt-16">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Create a new secure password for your account.</p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <Field
            icon={<Lock className="h-4 w-4" />}
            type="password"
            value={p1}
            onChange={setP1}
            placeholder="New password"
          />
          <Field
            icon={<Lock className="h-4 w-4" />}
            type="password"
            value={p2}
            onChange={setP2}
            placeholder="Confirm new password"
          />
          <PrimaryButton type="submit" className="mt-4" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Updating...
              </span>
            ) : (
              "Reset Password"
            )}
          </PrimaryButton>
        </form>
      </div>
    </Screen>
  );
}

function Field({
  icon,
  type,
  value,
  onChange,
  placeholder,
}: {
  icon: React.ReactNode;
  type: string;
  value: string;
  onChange: (s: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex h-14 items-center gap-3 rounded-2xl bg-muted px-4">
      <span className="text-muted-foreground">{icon}</span>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none"
      />
    </div>
  );
}

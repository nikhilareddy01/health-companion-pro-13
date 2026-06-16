import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({ component: Page });

function Page() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/welcome`, data: { name } },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    localStorage.setItem('demo_name', name);
    localStorage.setItem('demo_email', email);
    navigate({ to: "/welcome" });
  };

  return (
    <div className="mobile-frame flex flex-col bg-background">
      <div className="px-7 pt-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Start your health journey with us today.</p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-4 px-7 pt-8">
        <FieldIcon icon={<User className="h-4 w-4" />}><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></FieldIcon>
        <FieldIcon icon={<Mail className="h-4 w-4" />}><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></FieldIcon>
        <FieldIcon icon={<Lock className="h-4 w-4" />}>
          <input type={show ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          <button type="button" onClick={() => setShow((s) => !s)} className="text-muted-foreground">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </FieldIcon>
        <p className="text-xs text-muted-foreground">By signing up, you agree to our Terms & Privacy Policy.</p>
        <div className="mt-auto pb-8 pt-4">
          <PrimaryButton type="submit" disabled={loading}>{loading ? "Creating..." : "Sign Up"}</PrimaryButton>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary">Log in</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

function FieldIcon({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex h-14 items-center gap-3 rounded-2xl bg-muted px-4">
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </div>
  );
}

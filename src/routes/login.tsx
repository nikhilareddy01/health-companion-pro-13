import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, CheckSquare, Square } from "lucide-react";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: Page });

function Page() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if saved credentials exist
    const savedEmail = localStorage.getItem("remembered_email");
    const savedPass = localStorage.getItem("remembered_password");
    if (savedEmail) {
      setEmail(savedEmail);
    }
    if (savedPass) {
      setPassword(savedPass);
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    if (rememberMe) {
      localStorage.setItem("remembered_email", email);
      localStorage.setItem("remembered_password", password);
    } else {
      localStorage.removeItem("remembered_email");
      localStorage.removeItem("remembered_password");
    }

    localStorage.setItem("demo_email", email);
    toast.success("Signed in successfully!");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="mobile-frame flex flex-col bg-background">
      <div className="px-7 pt-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Log in to continue your health journey.</p>
      </div>
      <form onSubmit={onSubmit} method="post" className="flex flex-1 flex-col gap-4 px-7 pt-8">
        <div className="flex h-14 items-center gap-3 rounded-2xl bg-muted px-4">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            name="username"
            id="username"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <div className="flex h-14 items-center gap-3 rounded-2xl bg-muted px-4">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <input
            type={show ? "text" : "password"}
            name="password"
            id="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-transparent text-sm outline-none"
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="text-muted-foreground">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between mt-1">
          <button
            type="button"
            onClick={() => setRememberMe(!rememberMe)}
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {rememberMe ? (
              <CheckSquare className="h-4 w-4 text-primary" />
            ) : (
              <Square className="h-4 w-4 text-muted-foreground" />
            )}
            Save password & email
          </button>

          <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <div className="mt-auto pb-8 pt-4">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Log In"}
          </PrimaryButton>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

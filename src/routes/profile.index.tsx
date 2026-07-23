import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { HeartPulse, Target, Bell, Settings, LogOut, ChevronRight, Camera, PhoneCall } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/profile/")({ component: Page });

function Page() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@example.com");

  useEffect(() => {
    const demoName = localStorage.getItem('demo_name');
    const demoEmail = localStorage.getItem('demo_email');
    if (demoEmail) setUserEmail(demoEmail);
    if (demoName) setUserName(demoName);
    else if (demoEmail) {
      const emailName = demoEmail.split('@')[0];
      setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
    }

    supabase.auth.getUser().then(({ data }: any) => {
      if (data?.user) {
        setUserEmail(data.user.email || "");
        if (data.user.user_metadata?.name) {
          setUserName(data.user.user_metadata.name);
        } else if (data.user.email) {
          const emailName = data.user.email.split('@')[0];
          setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
        }
      }
    });
  }, []);

  const logout = async () => { await supabase.auth.signOut(); navigate({ to: "/login" }); };
  return (
    <Screen noHeader bottomNav contentClass="px-5 pb-6">
      <div className="pt-6 text-center">
        <div className="relative mx-auto h-24 w-24">
          <div className="flex h-full w-full items-center justify-center rounded-full text-3xl font-bold text-primary-foreground shadow-[var(--shadow-float)]" style={{ background: "var(--gradient-primary)" }}>{userName.slice(0, 2).toUpperCase()}</div>
          <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-card shadow-[var(--shadow-soft)]"><Camera className="h-4 w-4 text-foreground" /></button>
        </div>
        <p className="mt-3 text-lg font-bold text-foreground">{userName}</p>
        <p className="text-xs text-muted-foreground">{userEmail}</p>
      </div>

      <div className="mt-6 space-y-2">
        <Row to="/profile/health" Icon={HeartPulse} t="Health Details" />
        <Row to="/profile/goals" Icon={Target} t="Goals" />
        <Row to="/profile/reminder" Icon={Bell} t="Reminders" />
        <Row to="/medicine/emergency" Icon={PhoneCall} t="Emergency Contact" />
        <Row to="/profile/settings" Icon={Settings} t="Settings" />
      </div>

      <button onClick={logout} className="mt-6 flex w-full items-center gap-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/15 text-destructive"><LogOut className="h-5 w-5" /></div>
        <p className="flex-1 text-left text-sm font-semibold text-destructive">Log out</p>
      </button>
    </Screen>
  );
}

function Row({ to, Icon, t }: { to: string; Icon: any; t: string }) {
  return (
    <Link to={to} className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon className="h-5 w-5" /></div>
      <p className="flex-1 text-sm font-semibold text-foreground">{t}</p>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

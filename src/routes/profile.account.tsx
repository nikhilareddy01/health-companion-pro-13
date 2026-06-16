import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/profile/account")({ component: Page });

function Page() {
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

    supabase.auth.getUser().then(({ data }) => {
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

  return (
    <Screen title="Account Settings" contentClass="px-5 pb-8">
      <form onSubmit={(e) => { e.preventDefault(); toast.success("Saved"); }} className="space-y-3">
        <Field label="Name" defaultValue={userName} key={`name-${userName}`} />
        <Field label="Email" type="email" defaultValue={userEmail} key={`email-${userEmail}`} />
        <Field label="Password" type="password" defaultValue="••••••••" />
        <div className="pt-6 space-y-3">
          <PrimaryButton type="submit">Save Changes</PrimaryButton>
          <PrimaryButton type="button" variant="destructive" onClick={() => toast.error("Account deletion requested")}>Delete Account</PrimaryButton>
        </div>
      </form>
    </Screen>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-muted-foreground">{label}</label>
      <input {...rest} className="h-12 w-full rounded-2xl bg-muted px-4 text-sm outline-none focus:ring-2 focus:ring-primary" />
    </div>
  );
}

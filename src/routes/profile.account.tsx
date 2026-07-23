import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getApiUrl } from "@/utils/api";

export const Route = createFileRoute("/profile/account")({ component: Page });

function Page() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Account states
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [phone, setPhone] = useState("+1 555-0199");

  useEffect(() => {
    const loadAccount = async (uid: string) => {
      try {
        const res = await fetch(getApiUrl(`/api/profiles/${uid}`));
        if (res.ok) {
          const data = await res.json();
          if (data && Object.keys(data).length > 0) {
            if (data.name) setUserName(data.name);
            if (data.email) setUserEmail(data.email);
            if (data.phone) setPhone(data.phone);
          }
        }
      } catch (err) {
        console.error("Failed to load profile details:", err);
      } finally {
        setLoading(false);
      }
    };

    import("@/integrations/supabase/client").then(({ supabase }) => {
      supabase.auth.getUser().then(({ data }: { data: any }) => {
        if (data?.user) {
          setUserId(data.user.id);
          // Set initial metadata fallbacks if present
          if (data.user.user_metadata?.name) setUserName(data.user.user_metadata.name);
          if (data.user.email) setUserEmail(data.user.email);
          loadAccount(data.user.id);
        } else {
          setLoading(false);
        }
      });
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.success("Account details updated locally (guest mode)");
      return;
    }

    setSaving(true);
    try {
      const updates = {
        name: userName,
        email: userEmail,
        phone: phone
      };

      const res = await fetch(getApiUrl(`/api/profiles/${userId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Failed to save changes");
      
      // Update Supabase user metadata name if possible
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.auth.updateUser({
        data: { name: userName }
      });

      toast.success("Changes saved successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update profile settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen title="Account Settings" contentClass="px-5 pb-8">
      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Loading account details...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Name</label>
            <input
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="h-12 w-full rounded-2xl bg-muted px-4 text-sm outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="h-12 w-full rounded-2xl bg-muted px-4 text-sm outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 w-full rounded-2xl bg-muted px-4 text-sm outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          <div className="pt-6 space-y-3">
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "Saving Changes..." : "Save Changes"}
            </PrimaryButton>
            <PrimaryButton
              type="button"
              variant="destructive"
              onClick={() => toast.error("Account deletion requested")}
            >
              Delete Account
            </PrimaryButton>
          </div>
        </form>
      )}
    </Screen>
  );
}

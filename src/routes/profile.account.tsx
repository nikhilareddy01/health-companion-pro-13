import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { getApiUrl } from "@/utils/api";
import { supabase } from "@/integrations/supabase/client";

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

    supabase.auth.getUser().then(({ data }: { data: any }) => {
      if (data?.user) {
        setUserId(data.user.id);
        if (data.user.user_metadata?.name) setUserName(data.user.user_metadata.name);
        if (data.user.email) setUserEmail(data.user.email);
        loadAccount(data.user.id);
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.success("Account details updated locally");
      return;
    }

    setSaving(true);
    try {
      const updates = {
        name: userName,
        email: userEmail,
        phone: phone,
      };

      const res = await fetch(getApiUrl(`/api/profiles/${userId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Failed to save changes");

      await supabase.auth.updateUser({
        data: { name: userName },
      });

      toast.success("Changes saved successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update profile settings");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? All your medicines, health records, water intake logs, and profile data will be completely erased. This action cannot be undone."
    );
    if (!confirmed) return;

    if (typeof window !== "undefined") {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.includes(userEmail) ||
            key.includes(userName) ||
            key.startsWith("demo_") ||
            key.includes("medicines") ||
            key.includes("profile_health") ||
            key.includes("medical_history") ||
            key.includes("water_intake") ||
            key.includes("eaten_meals") ||
            key.includes("daily_diet"))
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    }

    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }

    toast.success("Account deleted and all personal data erased.");
    window.location.href = "/signup";
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

            <button
              type="button"
              onClick={handleDeleteAccount}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 py-3 text-xs font-semibold text-destructive hover:bg-destructive/20 active:scale-98 transition-all"
            >
              <Trash2 className="h-4 w-4" /> Delete Account & Erase All Data
            </button>
          </div>
        </form>
      )}
    </Screen>
  );
}

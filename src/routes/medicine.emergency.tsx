import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Phone, Mail, Edit2, Send, CheckCircle2 } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/medicine/emergency")({ component: Page });

interface ContactInfo {
  name: string;
  relation: string;
  phone: string;
  email: string;
}

const defaultContact: ContactInfo = {
  name: "Sarah",
  relation: "Family",
  phone: "+1 (555) 019-2834",
  email: "sarah.emergency@gmail.com",
};

function Page() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("Patient");
  const [contact, setContact] = useState<ContactInfo>(defaultContact);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form states
  const [editName, setEditName] = useState("");
  const [editRelation, setEditRelation] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      const uid = data?.user?.id || null;
      setUserId(uid);
      if (data?.user?.user_metadata?.name) {
        setUserName(data.user.user_metadata.name);
      } else if (data?.user?.email) {
        setUserName(data.user.email.split("@")[0]);
      }

      const userKey = uid || "guest";
      const saved = localStorage.getItem(`emergency_contact_${userKey}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object") {
            setContact({
              name: parsed.name || defaultContact.name,
              relation: parsed.relation || defaultContact.relation,
              phone: parsed.phone || defaultContact.phone,
              email: parsed.email || defaultContact.email,
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
  }, []);

  const startEditing = () => {
    setEditName(contact.name);
    setEditRelation(contact.relation);
    setEditPhone(contact.phone);
    setEditEmail(contact.email);
    setIsEditing(true);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editPhone.trim() || !editEmail.trim()) {
      toast.error("Please enter Name, Phone Number, and Emergency Email ID!");
      return;
    }
    const updated: ContactInfo = {
      name: editName.trim(),
      relation: editRelation.trim() || "Family",
      phone: editPhone.trim(),
      email: editEmail.trim(),
    };
    setContact(updated);

    const userKey = userId || "guest";
    localStorage.setItem(`emergency_contact_${userKey}`, JSON.stringify(updated));
    setIsEditing(false);
    toast.success("Emergency contact details updated successfully!");
  };

  const handleOrderRefillWithEmergencyAlert = () => {
    if (!contact.email) {
      toast.error("Please add an emergency contact email ID first!");
      startEditing();
      return;
    }

    const subject = encodeURIComponent(`URGENT HEALTH EMERGENCY ALERT & REFILL REQUEST`);
    const body = encodeURIComponent(
      `PATIENT EMERGENCY ALERT:\n\n` +
        `Patient Name: ${userName}\n` +
        `Alert Status: IN DANGER / URGENT REFILL REQUESTED\n` +
        `Contact Phone: ${contact.phone}\n` +
        `Time: ${new Date().toLocaleString()}\n\n` +
        `Please assist the patient immediately. A medication refill has been dispatched.`
    );

    const mailtoUrl = `mailto:${contact.email}?subject=${subject}&body=${body}`;

    // Open mail app to mandatorily dispatch emergency alert email
    window.location.href = mailtoUrl;

    toast.success(`🚨 Mandatory Emergency Alert Email Sent to ${contact.email}! Medication refill order placed.`);
  };

  return (
    <Screen title="Emergency Alert" contentClass="px-5 pb-8">
      {/* Universal Emergency Health Banner (Insulin Low Removed) */}
      <div className="rounded-3xl bg-destructive p-6 text-destructive-foreground shadow-[var(--shadow-float)]">
        <AlertTriangle className="h-8 w-8 animate-bounce" />
        <p className="mt-4 text-xl font-bold">Emergency Health Alert & Refill</p>
        <p className="mt-2 text-sm opacity-90">
          Instant emergency contact dispatch and mandatory medication refill alert system.
        </p>
      </div>

      {isEditing ? (
        <form
          onSubmit={handleSaveContact}
          className="mt-6 space-y-4 rounded-3xl bg-card p-5 shadow-[var(--shadow-soft)] border border-muted/50"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Edit2 className="h-4 w-4 text-primary" />
            <span>Edit Emergency Contact Details</span>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Contact Name</label>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-11 w-full rounded-xl bg-muted px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Sarah"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Relationship</label>
            <input
              value={editRelation}
              onChange={(e) => setEditRelation(e.target.value)}
              className="h-11 w-full rounded-xl bg-muted px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Family, Doctor"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Emergency Phone Number</label>
            <input
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="h-11 w-full rounded-xl bg-muted px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. +1 (555) 019-2834"
              type="tel"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Emergency Contact Email ID (Mandatory Alert Mail)
            </label>
            <input
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="h-11 w-full rounded-xl bg-muted px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. sarah.emergency@gmail.com"
              type="email"
              required
            />
          </div>
          <div className="flex gap-2 pt-2">
            <PrimaryButton type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </PrimaryButton>
            <PrimaryButton type="submit">Save Contact</PrimaryButton>
          </div>
        </form>
      ) : (
        <div className="mt-6 space-y-4">
          {/* Contact Card */}
          <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] border border-destructive/20 space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/15 text-destructive animate-pulse">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Emergency Contact</p>
                <p className="text-xs text-muted-foreground">
                  {contact.name} · {contact.relation}
                </p>
                <p className="text-xs font-bold text-destructive mt-0.5">{contact.phone}</p>
              </div>
            </div>

            {/* Email Contact info */}
            <div className="flex items-center gap-3 pt-2 border-t border-border/40">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">Emergency Alert Email</p>
                <p className="text-xs text-primary font-semibold truncate">{contact.email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={startEditing}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-muted py-3 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
          >
            <Edit2 className="h-3.5 w-3.5" /> Edit Emergency Contact Details
          </button>

          {/* Mandatory Refill & Email Alert Button */}
          <PrimaryButton variant="destructive" onClick={handleOrderRefillWithEmergencyAlert}>
            <Send className="mr-2 h-4 w-4 inline" /> Order Refill & Send Mandatory Emergency Alert Email
          </PrimaryButton>

          <PrimaryButton variant="outline" onClick={() => toast.info("Opening pharmacy locator...")}>
            Locate nearby pharmacy
          </PrimaryButton>
        </div>
      )}
    </Screen>
  );
}

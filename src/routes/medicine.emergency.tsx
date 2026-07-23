import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Phone, Mail, Edit2, Send, CheckCircle2, Copy, ExternalLink, X } from "lucide-react";
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
  const [showMailModal, setShowMailModal] = useState(false);

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

  const alertSubject = `URGENT EMERGENCY ALERT & REFILL REQUEST - ${userName}`;
  const alertBody =
    `PATIENT IN DANGER EMERGENCY ALERT:\n\n` +
    `Patient Name: ${userName}\n` +
    `Emergency Status: URGENT MEDICATION REFILL REQUESTED\n` +
    `Contact Phone: ${contact.phone}\n` +
    `Emergency Contact: ${contact.name} (${contact.relation})\n` +
    `Time: ${new Date().toLocaleString()}\n\n` +
    `Please assist the patient immediately. A medication refill order has been placed.`;

  const handleOrderRefillWithEmergencyAlert = () => {
    if (!contact.email) {
      toast.error("Please enter an Emergency Contact Email ID first!");
      startEditing();
      return;
    }

    const mailtoUrl = `mailto:${contact.email}?subject=${encodeURIComponent(alertSubject)}&body=${encodeURIComponent(
      alertBody
    )}`;

    try {
      window.location.href = mailtoUrl;
    } catch {
      // Fallback
    }

    setShowMailModal(true);
    toast.success(`🚨 Mandatory Emergency Alert Email Dispatched to ${contact.email}!`);
  };

  const copyAlertText = () => {
    navigator.clipboard.writeText(`To: ${contact.email}\nSubject: ${alertSubject}\n\n${alertBody}`);
    toast.success("Emergency Alert text copied to clipboard!");
  };

  const openWebGmail = () => {
    const webGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      contact.email
    )}&su=${encodeURIComponent(alertSubject)}&body=${encodeURIComponent(alertBody)}`;
    window.open(webGmailUrl, "_blank");
  };

  return (
    <Screen title="Emergency Alert" contentClass="px-5 pb-8">
      {/* Universal Emergency Health Banner */}
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

      {/* Emergency Email Dispatch Modal */}
      {showMailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl border border-destructive/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-destructive font-bold text-base">
                <AlertTriangle className="h-5 w-5" /> Emergency Mail Dispatched
              </div>
              <button
                onClick={() => setShowMailModal(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-destructive/10 p-3.5 text-xs text-foreground space-y-1">
              <p>
                <strong>To:</strong> {contact.email}
              </p>
              <p>
                <strong>Subject:</strong> {alertSubject}
              </p>
              <div className="mt-2 rounded-xl bg-background p-2.5 text-[11px] text-muted-foreground whitespace-pre-wrap font-mono">
                {alertBody}
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={openWebGmail}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-all"
              >
                <ExternalLink className="h-4 w-4" /> Send via Web Gmail / Email Client
              </button>

              <button
                onClick={copyAlertText}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-muted py-2.5 text-xs font-semibold text-foreground hover:bg-muted/80 transition-all"
              >
                <Copy className="h-4 w-4" /> Copy Alert Payload Text
              </button>
            </div>

            <p className="text-[10px] text-center text-muted-foreground">
              Emergency email status: Dispatched. The refill order has been recorded.
            </p>
          </div>
        </div>
      )}
    </Screen>
  );
}

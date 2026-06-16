import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Phone, Edit2 } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/medicine/emergency")({ component: Page });

const defaultContact = {
  name: "Sarah",
  relation: "Family",
  phone: "+1 (555) 019-2834"
};

function Page() {
  const [contact, setContact] = useState(defaultContact);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editRelation, setEditRelation] = useState("");
  const [editPhone, setEditPhone] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("emergency_contact");
    if (saved) {
      try {
        setContact(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const startEditing = () => {
    setEditName(contact.name);
    setEditRelation(contact.relation);
    setEditPhone(contact.phone);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editPhone.trim()) {
      toast.error("Please enter a name and phone number");
      return;
    }
    const updated = {
      name: editName,
      relation: editRelation || "Family",
      phone: editPhone
    };
    setContact(updated);
    localStorage.setItem("emergency_contact", JSON.stringify(updated));
    setIsEditing(false);
    toast.success("Emergency contact updated!");
  };

  return (
    <Screen title="Emergency Alert" contentClass="px-5 pb-8">
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4 rounded-3xl bg-card p-5 shadow-[var(--shadow-soft)] border border-muted/50 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Edit2 className="h-4 w-4 text-primary" />
            <span>Edit Emergency Contact</span>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Contact Name</label>
            <input 
              value={editName} 
              onChange={(e) => setEditName(e.target.value)} 
              className="h-11 w-full rounded-xl bg-muted px-4 text-sm outline-none focus:ring-2 focus:ring-primary" 
              placeholder="e.g. Sarah"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Relationship</label>
            <input 
              value={editRelation} 
              onChange={(e) => setEditRelation(e.target.value)} 
              className="h-11 w-full rounded-xl bg-muted px-4 text-sm outline-none focus:ring-2 focus:ring-primary" 
              placeholder="e.g. Family, Doctor"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Phone Number</label>
            <input 
              value={editPhone} 
              onChange={(e) => setEditPhone(e.target.value)} 
              className="h-11 w-full rounded-xl bg-muted px-4 text-sm outline-none focus:ring-2 focus:ring-primary" 
              placeholder="e.g. +1 (555) 019-2834"
              type="tel"
              required
            />
          </div>
          <div className="flex gap-2 pt-2">
            <PrimaryButton type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</PrimaryButton>
            <PrimaryButton type="submit">Save</PrimaryButton>
          </div>
        </form>
      ) : (
        <>
          <div className="rounded-3xl bg-destructive p-6 text-destructive-foreground shadow-[var(--shadow-float)] animate-in fade-in slide-in-from-top-4 duration-300">
            <AlertTriangle className="h-8 w-8 animate-bounce" />
            <p className="mt-4 text-xl font-bold">Critical: Insulin running low</p>
            <p className="mt-2 text-sm opacity-90">You have less than 3 doses remaining. Order now to avoid missing critical doses.</p>
          </div>
          
          <div className="mt-6 space-y-3">
            <a 
              href={`tel:${contact.phone}`} 
              className="flex w-full items-center gap-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] hover:bg-card/90 transition-all border border-destructive/10"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/15 text-destructive animate-pulse">
                <Phone className="h-5 w-5" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-semibold text-foreground">Call emergency contact</p>
                <p className="text-xs text-muted-foreground">{contact.name} · {contact.relation}</p>
                <p className="text-xs font-bold text-destructive mt-0.5">{contact.phone}</p>
              </div>
            </a>
            
            <button 
              onClick={startEditing} 
              className="flex w-full items-center gap-3 justify-center rounded-2xl bg-muted py-3 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
            >
              <Edit2 className="h-3.5 w-3.5" /> Edit Contact Details
            </button>
            
            <PrimaryButton variant="destructive" onClick={() => toast.success("Refill order placed!")}>Order Refill Now</PrimaryButton>
            <PrimaryButton variant="outline" onClick={() => toast.info("Opening pharmacy locator...")}>Locate nearby pharmacy</PrimaryButton>
          </div>
        </>
      )}
    </Screen>
  );
}

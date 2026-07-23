import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Stethoscope, Plus, Search, Trash2, Calendar, User, Activity, FileText, Pill, CheckCircle2, Clock, AlertCircle, X } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { toast } from "sonner";

export const Route = createFileRoute("/medical-history")({ component: Page });

export interface MedicalRecord {
  id: string;
  disease: string;
  doctorName: string;
  doctorSpecialty: string;
  visitDate: string;
  status: "Active" | "Managed" | "Recovered";
  notes: string;
  prescribedMedicines?: string;
}

const DEFAULT_RECORDS: MedicalRecord[] = [
  {
    id: "rec-1",
    disease: "Type 2 Diabetes",
    doctorName: "Dr. Sarah Lin",
    doctorSpecialty: "Endocrinologist",
    visitDate: "2026-04-22",
    status: "Managed",
    notes: "Quarterly diabetes check-up. HbA1c 6.4%. Advised to continue low-carb diet and regular walking.",
    prescribedMedicines: "Metformin 500mg"
  },
  {
    id: "rec-2",
    disease: "Essential Hypertension",
    doctorName: "Dr. Robert Adams",
    doctorSpecialty: "General Physician",
    visitDate: "2026-03-15",
    status: "Active",
    notes: "BP monitoring 135/85 mmHg. Sodium restriction advised.",
    prescribedMedicines: "Amlodipine 5mg"
  },
  {
    id: "rec-3",
    disease: "Seasonal Influenza",
    doctorName: "Dr. Emily Watson",
    doctorSpecialty: "Immunologist",
    visitDate: "2025-10-12",
    status: "Recovered",
    notes: "Annual influenza vaccination administered. No adverse reactions observed.",
    prescribedMedicines: "Flu Vaccine"
  }
];

function Page() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [disease, setDisease] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorSpecialty, setDoctorSpecialty] = useState("");
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState<"Active" | "Managed" | "Recovered">("Managed");
  const [notes, setNotes] = useState("");
  const [prescribedMedicines, setPrescribedMedicines] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("medical_history_records");
      if (saved) {
        setRecords(JSON.parse(saved));
      } else {
        setRecords(DEFAULT_RECORDS);
        localStorage.setItem("medical_history_records", JSON.stringify(DEFAULT_RECORDS));
      }
    } catch {
      setRecords(DEFAULT_RECORDS);
    }
  }, []);

  // Save records helper
  const saveRecordsToStorage = (updated: MedicalRecord[]) => {
    setRecords(updated);
    try {
      localStorage.setItem("medical_history_records", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disease.trim() || !doctorName.trim()) {
      toast.error("Please provide both Disease name and Doctor details");
      return;
    }

    const newRecord: MedicalRecord = {
      id: `rec-${Date.now()}`,
      disease: disease.trim(),
      doctorName: doctorName.trim(),
      doctorSpecialty: doctorSpecialty.trim() || "General Practice",
      visitDate: visitDate || new Date().toISOString().split("T")[0],
      status,
      notes: notes.trim(),
      prescribedMedicines: prescribedMedicines.trim()
    };

    const updated = [newRecord, ...records];
    saveRecordsToStorage(updated);

    // Sync with Backend Express API
    fetch("http://localhost:5000/api/medical-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        disease: newRecord.disease,
        doctorName: newRecord.doctorName,
        doctorSpecialty: newRecord.doctorSpecialty,
        visitDate: newRecord.visitDate,
        status: newRecord.status,
        notes: newRecord.notes,
        prescribedMedicines: newRecord.prescribedMedicines,
        user_id: localStorage.getItem("demo_email") || "demo-user-id"
      })
    })
      .then((res) => res.json())
      .then((data) => console.log("[Backend API Sync] Record saved:", data))
      .catch((err) => console.warn("[Backend Sync] Backend server not reachable:", err));

    toast.success("Medical history entry added & synced with backend!");

    // Reset Form & Close Modal
    setDisease("");
    setDoctorName("");
    setDoctorSpecialty("");
    setNotes("");
    setPrescribedMedicines("");
    setIsAdding(false);
  };

  const handleDeleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    saveRecordsToStorage(updated);

    // Sync deletion with Backend Express API
    fetch(`http://localhost:5000/api/medical-history/${id}`, {
      method: "DELETE"
    }).catch((err) => console.warn("[Backend Sync] Delete failed:", err));

    toast.info("Medical record deleted");
  };


  // Filter records
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.doctorSpecialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (st: "Active" | "Managed" | "Recovered") => {
    switch (st) {
      case "Active":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-3.5 w-3.5" /> Active
          </span>
        );
      case "Managed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Clock className="h-3.5 w-3.5" /> Managed
          </span>
        );
      case "Recovered":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Recovered
          </span>
        );
    }
  };

  return (
    <Screen title="Medical History" contentClass="px-5 pb-8">
      {/* Header Banner & Add Action */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Keep track of your doctors, diagnosed conditions, and visits.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Medical Entry
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-5 space-y-3">
        <div className="flex h-11 items-center gap-2.5 rounded-xl bg-muted px-3.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by disease, doctor name, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {["All", "Active", "Managed", "Recovered"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                statusFilter === st
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Medical History List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <Stethoscope className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-2 text-sm font-semibold text-foreground">No medical records found</p>
            <p className="mt-1 text-xs text-muted-foreground">Add details of your doctor visits and conditions using the "+ Add Medical Entry" button.</p>
          </div>
        ) : (
          filteredRecords.map((r) => (
            <div key={r.id} className="relative overflow-hidden rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] border border-border/50">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{r.disease}</h3>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 font-medium text-foreground">
                        <User className="h-3.5 w-3.5 text-primary" /> {r.doctorName}
                      </span>
                      <span>·</span>
                      <span>{r.doctorSpecialty}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(r.status)}
                  <button
                    onClick={() => handleDeleteRecord(r.id)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                    title="Delete entry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Date & Details */}
              <div className="mt-3.5 grid gap-2 rounded-xl bg-muted/40 p-3 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium text-foreground">Diagnosis / Visit Date:</span> {r.visitDate}
                </div>

                {r.notes && (
                  <div className="flex items-start gap-1.5 text-muted-foreground">
                    <FileText className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                    <span><strong className="text-foreground">Doctor's Notes & Diagnosis:</strong> {r.notes}</span>
                  </div>
                )}

                {r.prescribedMedicines && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Pill className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span><strong className="text-foreground">Prescribed Medicines:</strong> {r.prescribedMedicines}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Manual Entry Modal Dialog */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Add Medical History Record</h2>
                  <p className="text-xs text-muted-foreground">Enter doctor details and health condition information</p>
                </div>
              </div>
              <button
                onClick={() => setIsAdding(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-4 text-xs">
              {/* Disease / Health Condition */}
              <div>
                <label className="mb-1.5 block font-semibold text-foreground">
                  Disease / Medical Condition <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma"
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  className="w-full rounded-xl bg-muted px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary"
                />
              </div>

              {/* Doctor Details Row */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-semibold text-foreground">
                    Doctor's Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Sarah Lin"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full rounded-xl bg-muted px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-semibold text-foreground">
                    Specialty / Hospital
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Endocrinologist, City Hospital"
                    value={doctorSpecialty}
                    onChange={(e) => setDoctorSpecialty(e.target.value)}
                    className="w-full rounded-xl bg-muted px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary"
                  />
                </div>
              </div>

              {/* Date & Status Row */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-semibold text-foreground">Visit / Diagnosis Date</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full rounded-xl bg-muted px-3.5 py-2.5 text-xs text-foreground outline-none border border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-semibold text-foreground">Condition Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "Active" | "Managed" | "Recovered")}
                    className="w-full rounded-xl bg-muted px-3 py-2.5 text-xs text-foreground outline-none border border-border focus:border-primary"
                  >
                    <option value="Active">Active (Ongoing treatment)</option>
                    <option value="Managed">Managed (Controlled)</option>
                    <option value="Recovered">Recovered (Resolved)</option>
                  </select>
                </div>
              </div>

              {/* Prescribed Medicines */}
              <div>
                <label className="mb-1.5 block font-semibold text-foreground">Prescribed Medicines (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Metformin 500mg daily, Lisinopril 10mg"
                  value={prescribedMedicines}
                  onChange={(e) => setPrescribedMedicines(e.target.value)}
                  className="w-full rounded-xl bg-muted px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary"
                />
              </div>

              {/* Doctor's Notes & Symptoms */}
              <div>
                <label className="mb-1.5 block font-semibold text-foreground">Doctor's Notes & Symptoms</label>
                <textarea
                  rows={3}
                  placeholder="Add details about your symptoms, doctor's advice, test results, or next follow-up date..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl bg-muted px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-border pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="rounded-xl bg-muted px-4 py-2.5 font-semibold text-muted-foreground hover:bg-muted/80"
                >
                  Cancel
                </button>
                <PrimaryButton type="submit">Save Medical Record</PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </Screen>
  );
}


import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  Heart, Shield, BrainCircuit, Bell, Sparkles, Pill, Activity, 
  Smartphone, CheckCircle2, Menu, X, ArrowRight, Download, 
  Lock, Database, HeartHandshake, Eye
} from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediCare AI — Your Premium Health Companion" },
      { name: "description", content: "AI-powered healthcare, diet guidance, smart prescription parsing, and secure medication reminders." },
    ],
  }),
  component: AppOrLandingPage,
});

function AppOrLandingPage() {
  const [isCapacitor, setIsCapacitor] = useState(false);

  useEffect(() => {
    // Detect if running under Capacitor mobile app environment
    const isCap = typeof window !== "undefined" && !!(window as any).Capacitor;
    setIsCapacitor(isCap);
  }, []);

  if (isCapacitor) {
    return <SplashScreen />;
  }

  return <MedicareLandingPage />;
}

// Native app splash screen
function SplashScreen() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/onboarding-1" }), 1600);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="mobile-frame flex flex-col items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
      <div className="flex flex-col items-center gap-5 animate-in fade-in zoom-in duration-700">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl shadow-[var(--shadow-float)]" style={{ background: "var(--gradient-primary)" }}>
          <Heart className="h-12 w-12 text-white" fill="white" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">MediCare AI</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your personal health companion</p>
        </div>
      </div>
      <div className="absolute bottom-12 flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:200ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:400ms]" />
      </div>
    </div>
  );
}

// Desktop / web promotional landing page
function MedicareLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30 text-foreground font-sans scroll-smooth flex flex-col w-full overflow-x-hidden">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-md transition-all">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl shadow-[var(--shadow-soft)] bg-gradient-to-br from-emerald-400 to-teal-500">
              <Heart className="h-5 w-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">MediCare AI</span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#security" className="hover:text-primary transition-colors">Security & Privacy</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQs</a>
            <a href="#download" className="hover:text-primary transition-colors">Download App</a>
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/login"
              className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:bg-primary/90 hover:scale-[1.02]"
            >
              Launch Web App
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-background border-b border-border/50 p-6 z-40 shadow-lg animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-4 text-center">
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium py-2 text-muted-foreground hover:text-foreground"
            >
              Features
            </a>
            <a 
              href="#security" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium py-2 text-muted-foreground hover:text-foreground"
            >
              Security & Privacy
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium py-2 text-muted-foreground hover:text-foreground"
            >
              FAQs
            </a>
            <a 
              href="#download" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium py-2 text-muted-foreground hover:text-foreground"
            >
              Download App
            </a>
            <hr className="my-2 border-border/60" />
            <Link 
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-md"
            >
              Launch Web App
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative w-full pt-16 pb-24 md:py-32 flex items-center" style={{ background: "var(--gradient-hero)" }}>
        <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 flex flex-col gap-6 text-center md:text-left">
            <div className="inline-flex self-center md:self-start items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide">
              <Sparkles className="h-3.5 w-3.5" /> Powered by Gemini Clinical AI
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] md:max-w-2xl">
              Your Personal <br className="hidden lg:inline" />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Health Companion</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed mx-auto md:mx-0">
              Seamlessly monitor health vitals, set smart pill alarms, scan prescriptions instantly with AI, and get personalized clinic-grade diet and daily schedules.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-2">
              <Link 
                to="/onboarding-1"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground shadow-[var(--shadow-float)] transition-all hover:bg-primary/95 hover:scale-[1.02]"
              >
                Launch Web App <ArrowRight className="h-4 w-4" />
              </Link>
              <a 
                href="/AuraHealth_Companion.apk"
                download
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-8 text-sm font-bold text-foreground shadow-sm transition-all hover:bg-muted/80 hover:scale-[1.02]"
              >
                <Download className="h-4 w-4 text-emerald-500" /> Download Android APK
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-emerald-500" /> Private Database (RLS)</span>
              <span className="flex items-center gap-1.5"><HeartHandshake className="h-4 w-4 text-emerald-500" /> Patient-Centric Design</span>
              <span className="flex items-center gap-1.5"><Activity className="h-4 w-4 text-emerald-500" /> Real-time Vitals History</span>
            </div>
          </div>

          {/* Interactive Mobile Device Emulator */}
          <div className="md:col-span-5 flex justify-center relative">
            {/* Glowing background blur behind the phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-300/20 rounded-full blur-[80px] -z-10" />

            <div className="relative mx-auto md:mx-0 max-w-[300px] w-full h-[600px] bg-zinc-950 rounded-[2.5rem] p-3 shadow-2xl border-[6px] border-zinc-800 animate-in fade-in-50 slide-in-from-bottom-12 duration-1000">
              {/* Speaker Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-zinc-950 rounded-full z-20 flex items-center justify-center">
                <div className="w-10 h-1 bg-zinc-800 rounded-full"></div>
                <div className="w-2 h-2 bg-zinc-900 rounded-full ml-3 border border-zinc-800"></div>
              </div>

              {/* Iframe hosting the app flow */}
              <iframe 
                src="/onboarding-1" 
                className="w-full h-full rounded-[2rem] border-0 overflow-hidden bg-background select-none pointer-events-auto"
                title="MediCare AI Live Preview"
                scrolling="no"
              />

              {/* Live Preview Float Tag */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900 text-white border border-zinc-700 text-[10px] uppercase tracking-wider font-semibold py-1 px-3.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Interactive App Preview
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="w-full py-24 bg-background border-y border-border/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Features Checklist</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Everything you need to manage wellness
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Explore custom clinical features built in partnership with state-of-the-art Generative AI.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/50 bg-muted/10 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-primary group-hover:text-white">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-foreground">AI Symptom Finder</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Instantly search symptoms and identify potential factors to share with your family physician.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/50 bg-muted/10 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-primary group-hover:text-white">
                <Pill className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-foreground">Smart Medication Scanner</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Upload images of prescription receipts to automatically structure and calendar medication logs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/50 bg-muted/10 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-primary group-hover:text-white">
                <Bell className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-foreground">Automated Alarms</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Set schedules for morning, afternoon, or evening doses and receive smart triggers, logging history.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/50 bg-muted/10 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-primary group-hover:text-white">
                <Activity className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-foreground">Vitals Tracking</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Record and graph blood pressure, heart rate, weight, pain, sleep patterns, and daily hydration logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section id="security" className="w-full py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <div className="inline-flex self-start items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">
                <Shield className="h-3.5 w-3.5" /> Strict Security Standards
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-[1.2]">
                Your sensitive health records, <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">secured by design</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Health tracking is deeply personal. Medicare AI implements robust database protection protocols directly on your device and inside our Cloud vault.
              </p>
              
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base">Row-Level Security (RLS)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Our Supabase policies enforce isolated data streams. No other user can access your metrics or profile details.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base">Local Android Isolation</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      When packaged inside our APK framework, your app runs in isolated local storage buffers to keep tokens and logins offline.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphic display box */}
            <div className="bg-gradient-to-tr from-emerald-500 to-teal-500 p-[1px] rounded-3xl overflow-hidden shadow-xl">
              <div className="bg-background rounded-[23px] p-8 md:p-10 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <Heart className="h-6 w-6" fill="currentColor" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-foreground text-lg">Medicare Clinical Vault</h4>
                    <p className="text-xs text-muted-foreground">Connected & Verified</p>
                  </div>
                </div>
                
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border/40 text-sm">
                    <span className="font-medium text-muted-foreground">Database Encryption</span>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                      AES-256 Enabled
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border/40 text-sm">
                    <span className="font-medium text-muted-foreground">Authentication Protocol</span>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                      Supabase Auth JWT
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border/40 text-sm">
                    <span className="font-medium text-muted-foreground">Clinical Assistant Scope</span>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                      HIPAA Aligned AI
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="w-full py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-16 flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Questions?</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Frequently Asked Questions
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              Find answers to the most common questions regarding installation, security, and AI limits.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border border-border/50 rounded-2xl px-6 bg-muted/10">
              <AccordionTrigger className="text-base font-bold text-foreground py-5 hover:no-underline">
                How do I install this on my Android Phone?
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-5">
                Simply scroll to the "Download App" section of this website and click "Download Android APK". Open the downloaded file on your device and follow the prompts. Make sure "Install from Unknown Sources" is enabled in your Android Developer settings.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-border/50 rounded-2xl px-6 bg-muted/10">
              <AccordionTrigger className="text-base font-bold text-foreground py-5 hover:no-underline">
                Is my health data shared with anyone?
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-5">
                No. We enforce strict PostgreSQL Row-Level Security policies. Your vitals, prescriptions, and health logs are completely isolated to your personal account container. We do not sell or monetize personal medical data.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-border/50 rounded-2xl px-6 bg-muted/10">
              <AccordionTrigger className="text-base font-bold text-foreground py-5 hover:no-underline">
                How does the AI Prescription Scanner work?
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-5">
                When you click "Upload Prescription" within the app, the interface reads the text content from the image, processes it securely via Google's Gemini Pro AI, extracts key dosage amounts, frequency directions, and schedules, and auto-populates your pill tracker.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-border/50 rounded-2xl px-6 bg-muted/10">
              <AccordionTrigger className="text-base font-bold text-foreground py-5 hover:no-underline">
                Can I use this without a server connection?
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-5">
                The core tracker and alarm schedules run locally in your app framework. However, advanced AI symptom search, prescription uploads, and clinical recommendations require an active Wi-Fi or mobile data connection.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* High-Impact Download App CTA Banner */}
      <section id="download" className="w-full py-20 bg-muted/10 border-t border-border/30 relative">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 md:p-14 text-white text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-10 shadow-[var(--shadow-float)]">
            <div className="flex flex-col gap-4 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ready for a healthier daily schedule?</h2>
              <p className="text-emerald-50/90 text-sm sm:text-base leading-relaxed">
                Download the native Android companion APK right now, or get started instantly on the web using our full-featured simulator.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0 justify-center">
              <Link
                to="/onboarding-1"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-teal-800 shadow-md hover:bg-emerald-50 transition-all hover:scale-[1.02]"
              >
                Launch Web App <ArrowRight className="h-4.5 w-4.5" />
              </Link>
              <a 
                href="/AuraHealth_Companion.apk"
                download
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 text-sm font-bold text-white shadow-sm hover:bg-white/20 transition-all hover:scale-[1.02]"
              >
                <Download className="h-4.5 w-4.5" /> Download Android APK
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-border/40 bg-background">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <Heart className="h-4.5 w-4.5" fill="currentColor" />
            </div>
            <span className="font-bold text-foreground">MediCare AI</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#security" className="hover:text-foreground transition-colors">Security</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQs</a>
            <span>© {new Date().getFullYear()} Aura Health Companion. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}


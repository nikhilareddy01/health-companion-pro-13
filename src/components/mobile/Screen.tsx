import { ReactNode, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Home, Apple, Pill, TrendingUp, User, LogOut, ChevronLeft, Heart } from "lucide-react";
import { StatusBar } from "./StatusBar";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";
import { AIChatDrawer } from "./AIChatDrawer";
import { supabase } from "@/integrations/supabase/client";

interface ScreenProps {
  children: ReactNode;
  title?: string;
  back?: boolean;
  headerRight?: ReactNode;
  bottomNav?: boolean;
  noHeader?: boolean;
  bgClass?: string;
  contentClass?: string;
  transparentHeader?: boolean;
}

const navItems = [
  { to: "/dashboard", label: "Dashboard", Icon: Home },
  { to: "/diet", label: "Diet Plan", Icon: Apple },
  { to: "/medicine-overview", label: "Medicines", Icon: Pill },
  { to: "/progress", label: "Progress History", Icon: TrendingUp },
  { to: "/profile", label: "Account Settings", Icon: User },
] as const;

export function Screen({
  children,
  title,
  back = true,
  headerRight,
  bottomNav = false,
  noHeader = false,
  bgClass = "bg-background",
  contentClass = "",
  transparentHeader,
}: ScreenProps) {
  const [isMobile, setIsMobile] = useState(true);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isCap = typeof window !== "undefined" && !!(window as any).Capacitor;
    const isEmbed = typeof window !== "undefined" && window.self !== window.top;

    const checkViewport = () => {
      const isDesktop = window.innerWidth >= 768; // md breakpoint
      setIsMobile(isCap || isEmbed || !isDesktop);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);

    // Get user info for sidebar
    supabase.auth.getUser().then(({ data }: { data: any }) => {
      if (data?.user) {
        setUserEmail(data.user.email || "");
        if (data.user.user_metadata?.name) {
          setUserName(data.user.user_metadata.name);
        } else if (data.user.email) {
          const emailName = data.user.email.split("@")[0];
          setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
        }
      }
    });

    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Full-width Desktop Layout
  if (!isMobile) {
    return (
      <div className={`flex min-h-screen w-full bg-muted/20 ${bgClass} desktop-exclude`}>
        {/* Desktop Sidebar Navigation */}
        <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0 shrink-0 z-30">
          {/* Logo Brand Header */}
          <div className="h-16 flex items-center gap-2.5 px-6 border-b border-border/40">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg shadow-sm bg-gradient-to-br from-emerald-400 to-teal-500">
              <Heart className="h-4.5 w-4.5 text-white" fill="white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">MediCare AI</span>
          </div>

          {/* Sidebar Links */}
          <nav className="flex-1 py-6 px-4 space-y-1">
            {navItems.map(({ to, label, Icon }) => {
              const active = location.pathname === to || location.pathname.startsWith(to + "/");
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar footer profile details */}
          <div className="p-4 border-t border-border/40 bg-muted/10 space-y-3">
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-primary-foreground bg-primary">
                {userName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
            </div>
            <div className="space-y-1 pt-1">
              <button
                onClick={async () => {
                  try {
                    await supabase.auth.signOut();
                  } catch {
                    // Ignore errors
                  }
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("demo_email");
                    localStorage.removeItem("demo_name");
                    localStorage.removeItem("demo_user_id");
                  }
                  window.location.href = "/login";
                }}
                className="flex items-center gap-3 w-full px-3.5 py-2 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10 transition-all duration-200"
              >
                <LogOut className="h-4.5 w-4.5" />
                Sign Out
              </button>

              <button
                onClick={async () => {
                  const confirmed = window.confirm(
                    "Are you sure you want to permanently delete your account? All your personal data and health history will be erased immediately. This cannot be undone."
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
                  window.location.href = "/signup";
                }}
                className="flex items-center gap-3 w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 opacity-70 rotate-180 text-muted-foreground" />
                Delete Account & Data
              </button>
            </div>
          </div>
        </aside>

        {/* Content Container */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Top Header */}
          {!noHeader && (
            <header className="h-16 border-b border-border bg-card px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
              <div className="flex items-center gap-3">
                {back && (
                  <button
                    onClick={() => window.history.back()}
                    className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}
                <h2 className="text-lg font-bold tracking-tight text-foreground">{title || "MediCare AI"}</h2>
              </div>
              <div>{headerRight}</div>
            </header>
          )}

          {/* Content Body */}
          <main className={`flex-1 overflow-y-auto p-8 max-w-6xl w-full mx-auto ${contentClass}`}>
            {children}
          </main>
        </div>

        {/* Floating Chat Widget */}
        <AIChatDrawer />
      </div>
    );
  }

  // Mobile simulator wrapper (For mobile users, Capacitor shell, or Embedded iframe)
  return (
    <div className={`mobile-frame flex flex-col ${bgClass}`}>
      <StatusBar />
      {!noHeader && (
        <AppHeader title={title} back={back} right={headerRight} transparent={transparentHeader} />
      )}
      <main className={`flex-1 overflow-y-auto hide-scrollbar ${contentClass}`}>
        {children}
      </main>
      {bottomNav && <BottomNav />}
      <AIChatDrawer />
    </div>
  );
}


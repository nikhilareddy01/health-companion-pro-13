import type { ReactNode } from "react";
import { StatusBar } from "./StatusBar";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";

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
    </div>
  );
}

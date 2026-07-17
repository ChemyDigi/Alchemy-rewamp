"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface MobileMenuContextValue {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const MobileMenuContext = createContext<MobileMenuContextValue | null>(null);

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <MobileMenuContext.Provider value={{ isMobileMenuOpen, setMobileMenuOpen }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  const ctx = useContext(MobileMenuContext);
  if (!ctx) {
    return { isMobileMenuOpen: false, setMobileMenuOpen: () => {} };
  }
  return ctx;
}

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const SESSION_KEY = "alchemy_admin_auth";

interface AuthContextValue {
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isAdmin: false,
  loading: true,
  login: () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === "true") setIsAdmin(true);
    setLoading(false);
  }, []);

  function login(email: string, password: string): boolean {
    const validEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (email === validEmail && password === validPassword) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setIsAdmin(true);
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

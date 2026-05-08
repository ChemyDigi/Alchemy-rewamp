"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAdmin, loading: authLoading, login } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAdmin) {
      router.replace("/admin/dashboard");
    }
  }, [isAdmin, authLoading, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Small artificial delay for UX feel
    await new Promise((r) => setTimeout(r, 400));

    const success = login(email, password);
    if (success) {
      toast.success("Logged in successfully");
      router.push("/admin/dashboard");
    } else {
      toast.error("Invalid email or password.");
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#e3791d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center px-4">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#e3791d]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#e3791d]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e3791d] rounded-2xl mb-4 shadow-lg shadow-[#e3791d]/30">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Alchemy Solutions
          </h1>
          <p className="text-slate-400 text-sm mt-1">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-[#12122a] border border-[#1e2040] rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white text-xl font-semibold mb-6">
            Sign in to continue
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="w-full bg-[#0d0d1a] border border-[#2d2d50] rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#e3791d] focus:ring-1 focus:ring-[#e3791d] transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#0d0d1a] border border-[#2d2d50] rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#e3791d] focus:ring-1 focus:ring-[#e3791d] transition-all text-sm"
              />
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-[#e3791d] hover:bg-[#cc6a18] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Protected area — authorized personnel only
        </p>
      </div>
    </div>
  );
}

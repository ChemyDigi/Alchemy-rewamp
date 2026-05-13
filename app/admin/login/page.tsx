"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Lock, Mail, Zap } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAdmin, loading: authLoading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAdmin) {
      router.replace("/admin/dashboard");
    }
  }, [isAdmin, authLoading, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#e3791d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {/* Subtle bg pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#e3791d] to-[#f09a4e] rounded-2xl mb-4 shadow-lg shadow-orange-200">
            <Zap size={26} className="text-white" fill="white" />
          </div>
          <h1 className="text-gray-900 text-2xl font-bold tracking-tight">
            Alchemy Solutions
          </h1>
          <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm shadow-gray-200">
          <h2 className="text-gray-800 text-lg font-bold mb-6">
            Sign in to continue
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#e3791d] focus:ring-2 focus:ring-orange-100 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#e3791d] focus:ring-2 focus:ring-orange-100 transition-all text-sm"
                />
              </div>
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#e3791d] to-[#f09a4e] hover:from-[#cc6a18] hover:to-[#e3791d] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2 shadow-sm shadow-orange-200 hover:shadow-md hover:shadow-orange-200"
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

        <p className="text-center text-gray-400 text-xs mt-6">
          Protected area — authorized personnel only
        </p>
      </div>
    </div>
  );
}

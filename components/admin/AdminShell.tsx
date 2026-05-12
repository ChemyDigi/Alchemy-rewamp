"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  FileText,
  Images,
  Users,
  Home,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Layers,
  Tag,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Blogs", href: "/admin/blogs", icon: <FileText size={18} /> },
  { label: "Gallery", href: "/admin/gallery", icon: <Images size={18} /> },
  { label: "Brands", href: "/admin/brands", icon: <Tag size={18} /> },
  { label: "Team", href: "/admin/team", icon: <Users size={18} /> },
  { label: "Home Page", href: "/admin/home", icon: <Home size={18} /> },
  {
    label: "Services",
    href: "/admin/services",
    icon: <Layers size={18} />,
    children: [
      { label: "IT Solutions", href: "/admin/services/it" },
      { label: "AV Production", href: "/admin/services/av-production" },
      { label: "Digital Marketing", href: "/admin/services/digital-marketing" },
      { label: "Event Management", href: "/admin/services/event-management" },
    ],
  },
];

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#e3791d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;
  return <>{children}</>;
}

export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { logout } = useAuth();

  function handleLogout() {
    logout();
    toast.success("Logged out");
    router.push("/admin/login");
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const currentLabel =
    navItems.find((n) => isActive(n.href) && !n.children)?.label ??
    navItems.flatMap((n) => n.children ?? []).find((c) => isActive(c.href))?.label ??
    "Admin";

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#0d0d1a] flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-[#080818] border-r border-[#1a1a35] z-30 flex flex-col transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
        >
          {/* Brand */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-[#1a1a35]">
            <div className="w-9 h-9 bg-[#e3791d] rounded-xl flex items-center justify-center shadow-lg shadow-[#e3791d]/25 flex-shrink-0">
              <span className="text-white font-black text-lg">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight truncate">Alchemy Solutions</p>
              <p className="text-slate-500 text-xs">Admin Panel</p>
            </div>
            <button
              className="lg:hidden text-slate-500 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
            <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-3 mb-3">
              Navigation
            </p>
            {navItems.map((item) => {
              const active = isActive(item.href);

              if (item.children) {
                const expanded = servicesExpanded || active;
                return (
                  <div key={item.href}>
                    <button
                      onClick={() => setServicesExpanded((v) => !v)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                        ${active ? "bg-[#e3791d]/15 text-[#e3791d]" : "text-slate-400 hover:bg-[#12122a] hover:text-slate-200"}`}
                    >
                      <span>{item.icon}</span>
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronRight
                        size={13}
                        className={`transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
                      />
                    </button>
                    {expanded && (
                      <div className="mt-1 ml-4 border-l border-[#1a1a35] pl-3 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`block px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
                              ${isActive(child.href) ? "bg-[#e3791d]/15 text-[#e3791d]" : "text-slate-500 hover:bg-[#12122a] hover:text-slate-300"}`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${active ? "bg-[#e3791d]/15 text-[#e3791d]" : "text-slate-400 hover:bg-[#12122a] hover:text-slate-200"}`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-[#1a1a35] p-3">
            <button
              id="admin-logout-btn"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main ─────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top bar */}
          <header className="sticky top-0 z-10 bg-[#080818]/90 backdrop-blur-md border-b border-[#1a1a35] px-4 lg:px-6 h-14 flex items-center gap-4">
            <button
              className="lg:hidden text-slate-400 hover:text-white transition-colors p-1"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span className="text-slate-300 font-medium text-sm">{currentLabel}</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-slate-500 text-xs hidden sm:block">Live</span>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}

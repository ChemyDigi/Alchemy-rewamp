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
  Zap,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={17} /> },
  { label: "Blogs", href: "/admin/blogs", icon: <FileText size={17} /> },
  { label: "Gallery", href: "/admin/gallery", icon: <Images size={17} /> },
  { label: "Brands", href: "/admin/brands", icon: <Tag size={17} /> },
  { label: "Team", href: "/admin/team", icon: <Users size={17} /> },
  { label: "Home Page", href: "/admin/home", icon: <Home size={17} /> },
  {
    label: "Services",
    href: "/admin/services",
    icon: <Layers size={17} />,
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#e3791d] border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px' }} />
          <p className="text-gray-400 text-sm font-medium">Loading...</p>
        </div>
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
    toast.success("Logged out successfully");
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
      <div className="min-h-screen bg-gray-50 flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <aside
          className={`fixed top-0 left-0 h-full w-[240px] bg-white border-r border-gray-100 z-30 flex flex-col transform transition-transform duration-300 shadow-sm
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
        >
          {/* Brand */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
            <div className="w-9 h-9 bg-gradient-to-br from-[#e3791d] to-[#f09a4e] rounded-xl flex items-center justify-center shadow-md shadow-orange-200 flex-shrink-0">
              <Zap size={17} className="text-white" fill="white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-bold text-sm leading-tight truncate">Alchemy</p>
              <p className="text-gray-400 text-xs font-medium">Admin Panel</p>
            </div>
            <button
              className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={15} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 mt-1">
              Menu
            </p>
            {navItems.map((item) => {
              const active = isActive(item.href);

              if (item.children) {
                const expanded = servicesExpanded || active;
                return (
                  <div key={item.href}>
                    <button
                      onClick={() => setServicesExpanded((v) => !v)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                        ${active
                          ? "bg-orange-50 text-[#e3791d]"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                        }`}
                    >
                      <span className={`transition-colors ${active ? "text-[#e3791d]" : "text-gray-400"}`}>
                        {item.icon}
                      </span>
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronRight
                        size={13}
                        className={`transition-transform duration-200 text-gray-300 ${expanded ? "rotate-90" : ""}`}
                      />
                    </button>
                    {expanded && (
                      <div className="mt-0.5 ml-3 border-l-2 border-gray-100 pl-3 space-y-0.5 pb-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
                              ${isActive(child.href)
                                ? "bg-orange-50 text-[#e3791d] font-semibold"
                                : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                              }`}
                          >
                            <span className={`w-1 h-1 rounded-full flex-shrink-0 ${isActive(child.href) ? "bg-[#e3791d]" : "bg-gray-300"}`} />
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
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${active
                      ? "bg-orange-50 text-[#e3791d]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                >
                  <span className={`transition-colors ${active ? "text-[#e3791d]" : "text-gray-400"}`}>
                    {item.icon}
                  </span>
                  {item.label}
                  {active && <span className="ml-auto w-1.5 h-1.5 bg-[#e3791d] rounded-full" />}
                </Link>
              );
            })}
          </nav>

          {/* User / Logout */}
          <div className="border-t border-gray-100 p-3">
            <button
              id="admin-logout-btn"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200 group"
            >
              <LogOut size={16} className="group-hover:text-red-500 transition-colors" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main ─────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top bar */}
          <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 lg:px-6 h-[58px] flex items-center gap-4 shadow-sm">
            <button
              className="lg:hidden text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-gray-800 font-semibold text-sm">{currentLabel}</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 lg:p-6 bg-gray-50">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}

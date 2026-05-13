"use client";

import { useEffect, useState } from "react";
import { getBlogs } from "@/lib/firestore";
import { getGallery } from "@/lib/firestore";
import { getTeam } from "@/lib/firestore";
import { StatCard, AdminCard } from "@/components/admin/AdminUI";
import { FileText, Images, Users, Layers, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

interface QuickLink {
  label: string;
  href: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const quickLinks: QuickLink[] = [
  { label: "Manage Blogs", href: "/admin/blogs", description: "Add, edit or delete blog posts", icon: <FileText size={18} />, color: "#6366f1" },
  { label: "Manage Gallery", href: "/admin/gallery", description: "Manage photo gallery images", icon: <Images size={18} />, color: "#0ea5e9" },
  { label: "Manage Team", href: "/admin/team", description: "Update team member profiles", icon: <Users size={18} />, color: "#10b981" },
  { label: "Manage Services", href: "/admin/services", description: "Edit service pages & projects", icon: <Layers size={18} />, color: "#e3791d" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    blogs: 0,
    gallery: 0,
    team: 0,
    loading: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const [blogs, gallery, team] = await Promise.all([
          getBlogs(),
          getGallery(),
          getTeam(),
        ]);
        setStats({ blogs: blogs.length, gallery: gallery.length, team: team.length, loading: false });
      } catch {
        setStats((s) => ({ ...s, loading: false }));
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#e3791d] to-[#f09a4e] rounded-2xl p-6 text-white shadow-lg shadow-orange-200/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-white text-2xl font-bold">Welcome back 👋</h1>
            <p className="text-orange-100 text-sm mt-1">
              Here&apos;s an overview of your website content.
            </p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp size={22} className="text-white" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Blog Posts"
          value={stats.loading ? "—" : stats.blogs}
          icon={<FileText size={20} />}
          color="#6366f1"
        />
        <StatCard
          label="Gallery Images"
          value={stats.loading ? "—" : stats.gallery}
          icon={<Images size={20} />}
          color="#0ea5e9"
        />
        <StatCard
          label="Team Members"
          value={stats.loading ? "—" : stats.team}
          icon={<Users size={20} />}
          color="#10b981"
        />
      </div>

      {/* Quick Actions */}
      <AdminCard>
        <h2 className="text-gray-800 font-semibold text-base mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-xl hover:border-gray-200 hover:bg-white hover:shadow-sm transition-all duration-200 group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: `${link.color}12`, color: link.color }}
              >
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 text-sm font-semibold">{link.label}</p>
                <p className="text-gray-400 text-xs truncate">{link.description}</p>
              </div>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          ))}
        </div>
      </AdminCard>

      {/* Info Box */}
      <AdminCard>
        <h2 className="text-gray-800 font-semibold text-base mb-3">Firestore Collections</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Make sure you have created the required Firestore collections and set the proper security rules.
        </p>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-gray-700 font-semibold text-xs uppercase tracking-wider mb-3">Required collections</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {["blogs", "gallery", "team", "homeContent", "services"].map((col) => (
              <div key={col} className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-2">
                <div className="w-1.5 h-1.5 bg-[#e3791d] rounded-full flex-shrink-0" />
                <span className="text-gray-600 text-xs font-mono font-medium">{col}</span>
              </div>
            ))}
          </div>
        </div>
      </AdminCard>
    </div>
  );
}

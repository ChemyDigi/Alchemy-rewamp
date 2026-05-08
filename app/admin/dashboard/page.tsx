"use client";

import { useEffect, useState } from "react";
import { getBlogs } from "@/lib/firestore";
import { getGallery } from "@/lib/firestore";
import { getTeam } from "@/lib/firestore";
import { StatCard, AdminCard } from "@/components/admin/AdminUI";
import { FileText, Images, Users, Layers, ArrowRight } from "lucide-react";
import Link from "next/link";

interface QuickLink {
  label: string;
  href: string;
  description: string;
  icon: React.ReactNode;
}

const quickLinks: QuickLink[] = [
  { label: "Manage Blogs", href: "/admin/blogs", description: "Add, edit or delete blog posts", icon: <FileText size={16} /> },
  { label: "Manage Gallery", href: "/admin/gallery", description: "Manage photo gallery images", icon: <Images size={16} /> },
  { label: "Manage Team", href: "/admin/team", description: "Update team member profiles", icon: <Users size={16} /> },
  { label: "Manage Services", href: "/admin/services", description: "Edit service pages & projects", icon: <Layers size={16} /> },
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
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#e3791d]/20 to-[#e3791d]/5 border border-[#e3791d]/20 rounded-2xl p-6">
        <h1 className="text-white text-2xl font-bold">Welcome back 👋</h1>
        <p className="text-slate-400 text-sm mt-1">
          Here&apos;s an overview of your website content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          label="Blog Posts"
          value={stats.loading ? "—" : stats.blogs}
          icon={<FileText size={20} />}
        />
        <StatCard
          label="Gallery Images"
          value={stats.loading ? "—" : stats.gallery}
          icon={<Images size={20} />}
        />
        <StatCard
          label="Team Members"
          value={stats.loading ? "—" : stats.team}
          icon={<Users size={20} />}
        />
      </div>

      {/* Quick Actions */}
      <AdminCard>
        <h2 className="text-white font-semibold text-base mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-4 p-4 bg-[#080818] border border-[#1a1a35] rounded-xl hover:border-[#e3791d]/30 hover:bg-[#0f0f22] transition-all duration-200 group"
            >
              <div className="w-9 h-9 bg-[#e3791d]/10 rounded-lg flex items-center justify-center text-[#e3791d] flex-shrink-0 group-hover:bg-[#e3791d]/20 transition-colors">
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{link.label}</p>
                <p className="text-slate-500 text-xs truncate">{link.description}</p>
              </div>
              <ArrowRight size={14} className="text-slate-600 group-hover:text-[#e3791d] transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </AdminCard>

      {/* Info Box */}
      <AdminCard>
        <h2 className="text-white font-semibold text-base mb-3">Firestore Setup</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-3">
          Make sure you have created the required Firestore collections and set the proper security rules.
        </p>
        <div className="bg-[#080818] rounded-xl p-4 font-mono text-xs text-slate-400 leading-relaxed border border-[#1a1a35]">
          <p className="text-slate-300 font-semibold mb-2">Required collections:</p>
          {["blogs", "gallery", "team", "homeContent", "services"].map((col) => (
            <p key={col} className="before:content-['•'] before:mr-2 before:text-[#e3791d]">{col}</p>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

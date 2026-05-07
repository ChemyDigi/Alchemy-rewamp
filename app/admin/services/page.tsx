import Link from "next/link";
import { AdminCard, PageHeader } from "@/components/admin/AdminUI";
import { ArrowRight, Cpu, Camera, TrendingUp, Calendar } from "lucide-react";

const services = [
  {
    slug: "it",
    label: "IT Solutions",
    description: "Manage IT service content and projects",
    icon: <Cpu size={22} />,
    href: "/admin/services/it",
  },
  {
    slug: "av-production",
    label: "AV Production",
    description: "Manage AV production content and projects",
    icon: <Camera size={22} />,
    href: "/admin/services/av-production",
  },
  {
    slug: "digital-marketing",
    label: "Digital Marketing",
    description: "Manage digital marketing content and projects",
    icon: <TrendingUp size={22} />,
    href: "/admin/services/digital-marketing",
  },
  {
    slug: "event-management",
    label: "Event Management",
    description: "Manage event management content and projects",
    icon: <Calendar size={22} />,
    href: "/admin/services/event-management",
  },
];

export default function ServicesIndexPage() {
  return (
    <>
      <PageHeader
        title="Services"
        description="Select a service to manage its content and projects"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((service) => (
          <Link key={service.slug} href={service.href}>
            <AdminCard className="hover:border-[#e3791d]/30 hover:bg-[#0f0f22] transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#e3791d]/10 rounded-xl flex items-center justify-center text-[#e3791d] flex-shrink-0 group-hover:bg-[#e3791d]/20 transition-colors">
                  {service.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-base">{service.label}</p>
                  <p className="text-slate-500 text-sm">{service.description}</p>
                </div>
                <ArrowRight size={16} className="text-slate-600 group-hover:text-[#e3791d] transition-colors flex-shrink-0" />
              </div>
            </AdminCard>
          </Link>
        ))}
      </div>
    </>
  );
}

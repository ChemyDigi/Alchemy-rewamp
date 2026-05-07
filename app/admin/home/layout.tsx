import AdminShell from "@/components/admin/AdminShell";
export default function HomeAdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}

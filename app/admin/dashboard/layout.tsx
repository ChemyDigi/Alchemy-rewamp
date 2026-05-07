import AdminShell from "@/components/admin/AdminShell";

export default function AdminPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}

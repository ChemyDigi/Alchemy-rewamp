import AdminShellLayout from "@/components/admin/AdminShell";

export default function BrandsAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShellLayout>{children}</AdminShellLayout>;
}

import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import AdminToaster from "@/components/admin/AdminToaster";

export const metadata: Metadata = {
  title: "Admin — Alchemy Solutions",
  description: "Alchemy Solutions Admin Panel",
  robots: "noindex, nofollow",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminToaster />
      {children}
    </AuthProvider>
  );
}

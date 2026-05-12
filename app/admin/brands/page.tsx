"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { PageHeader, AdminCard, EmptyState, AdminButton } from "@/components/admin/AdminUI";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface Brand {
  id: string;
  brandName: string;
  slug: string;
  heroImage: string;
  bornYear: string;
  introduction: string;
}

export default function BrandsAdminPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function fetchBrands() {
    setLoading(true);
    try {
      const q = query(collection(db, "brands"), orderBy("brandName"));
      const snap = await getDocs(q);
      setBrands(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Brand))
      );
    } catch {
      toast.error("Failed to load brands");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBrands();
  }, []);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "brands", id));
      setBrands((prev) => prev.filter((b) => b.id !== id));
      toast.success("Brand deleted");
    } catch {
      toast.error("Failed to delete brand");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Brands"
        description="Manage client brand pages shown in the DM carousel"
        action={
          <Link href="/admin/brands/new">
            <AdminButton>
              <Plus size={15} />
              Add Brand
            </AdminButton>
          </Link>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#e3791d] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : brands.length === 0 ? (
        <EmptyState
          icon={<Tag size={28} />}
          title="No brands yet"
          description="Add your first brand to display on the DM service page carousel"
          action={
            <Link href="/admin/brands/new">
              <AdminButton>
                <Plus size={15} />
                Add Brand
              </AdminButton>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand) => (
            <AdminCard key={brand.id} className="flex flex-col gap-4">
              {/* Hero preview */}
              <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#12122a]">
                {brand.heroImage ? (
                  <img
                    src={brand.heroImage}
                    alt={brand.brandName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-600 text-sm">
                    No hero image
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-white font-semibold text-base">{brand.brandName}</p>
                <p className="text-slate-500 text-xs mt-0.5">/{brand.slug}</p>
                {brand.introduction && (
                  <p className="text-slate-400 text-xs mt-2 line-clamp-2">
                    {brand.introduction}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#1a1a35]">
                <Link href={`/admin/brands/${brand.id}`} className="flex-1">
                  <AdminButton variant="secondary" size="sm" className="w-full">
                    <Pencil size={13} />
                    Edit
                  </AdminButton>
                </Link>
                <AdminButton
                  variant="danger"
                  size="sm"
                  loading={deletingId === brand.id}
                  onClick={() => setConfirmId(brand.id)}
                >
                  <Trash2 size={13} />
                </AdminButton>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmId}
        title="Delete brand?"
        message="This will permanently remove the brand and its page. This action cannot be undone."
        onConfirm={() => confirmId && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
}

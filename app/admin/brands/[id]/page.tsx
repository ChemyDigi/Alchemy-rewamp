"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import {
  PageHeader,
  AdminCard,
  AdminInput,
  AdminButton,
} from "@/components/admin/AdminUI";
import ImageUpload from "@/components/admin/ImageUpload";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface BrandForm {
  brandName: string;
  slug: string;
  heroImage: string;
}

const EMPTY_FORM: BrandForm = {
  brandName: "",
  slug: "",
  heroImage: "",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BrandEditorPage() {
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";
  const router = useRouter();

  const [form, setForm] = useState<BrandForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(isNew);

  // Load existing brand
  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "brands", id));
        if (snap.exists()) {
          const data = snap.data();
          setForm({
            brandName: data.brandName ?? "",
            slug: data.slug ?? "",
            heroImage: data.heroImage ?? "",
          });
        } else {
          toast.error("Brand not found");
          router.push("/admin/brands");
        }
      } catch {
        toast.error("Failed to load brand");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew, router]);

  function setField<K extends keyof BrandForm>(key: K, value: BrandForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(name: string) {
    setField("brandName", name);
    if (autoSlug) {
      setField("slug", slugify(name));
    }
  }

  async function handleSave() {
    if (!form.brandName.trim()) return toast.error("Brand name is required");
    if (!form.slug.trim()) return toast.error("Slug is required");
    if (!form.heroImage) return toast.error("Brand image/logo is required");

    setSaving(true);
    try {
      const payload = {
        ...form,
        updatedAt: serverTimestamp(),
      };

      if (isNew) {
        const ref = await addDoc(collection(db, "brands"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        toast.success("Brand created!");
        router.push(`/admin/brands/${ref.id}`);
      } else {
        await setDoc(doc(db, "brands", id), payload, { merge: true });
        toast.success("Brand saved!");
      }
    } catch {
      toast.error("Failed to save brand");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#e3791d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={isNew ? "New Brand" : `Edit: ${form.brandName || "Brand"}`}
        description="Set up the brand name, slug, and logo"
        action={
          <div className="flex items-center gap-2">
            <Link href="/admin/brands">
              <AdminButton variant="secondary" size="sm">
                <ArrowLeft size={14} />
                Back
              </AdminButton>
            </Link>
            <AdminButton onClick={handleSave} loading={saving}>
              <Save size={14} />
              {isNew ? "Create Brand" : "Save Changes"}
            </AdminButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left column: images ───────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <AdminCard>
            <p className="text-gray-900 font-semibold mb-4">Brand Logo / Image</p>
            <ImageUpload
              value={form.heroImage}
              onChange={(url) => setField("heroImage", url)}
              onRemove={() => setField("heroImage", "")}
              label="Brand logo image (displayed in the client carousel on services page)"
            />
          </AdminCard>
        </div>

        {/* ── Right column: text fields ─────────────────── */}
        <div className="space-y-6">
          <AdminCard>
            <p className="text-gray-900 font-semibold mb-4">Basic Info</p>
            <div className="space-y-4">
              <AdminInput
                label="Brand Name"
                placeholder="e.g. Tommee Tippee"
                value={form.brandName}
                onChange={(e) => handleNameChange(e.target.value)}
              />

              <div className="space-y-1.5">
                <label className="block text-gray-600 text-sm font-medium">
                  Slug (URL)
                </label>
                <div className="flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden focus-within:border-[#e3791d] focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                  <span className="text-gray-500 text-sm px-3 border-r border-gray-200 py-2.5 bg-gray-50">
                    /brand/
                  </span>
                  <input
                    className="flex-1 bg-transparent px-3 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none"
                    placeholder="my-brand-name"
                    value={form.slug}
                    onChange={(e) => {
                      setAutoSlug(false);
                      setField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"));
                    }}
                  />
                </div>
                <p className="text-gray-400 text-xs">
                  Auto-generated from name. Edit to customise.
                </p>
              </div>
            </div>
          </AdminCard>

          <AdminButton
            className="w-full"
            onClick={handleSave}
            loading={saving}
            size="lg"
          >
            <Save size={15} />
            {isNew ? "Create Brand" : "Save Changes"}
          </AdminButton>
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
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
  AdminTextarea,
  AdminButton,
} from "@/components/admin/AdminUI";
import ImageUpload from "@/components/admin/ImageUpload";
import { ArrowLeft, Plus, X, Save } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface BrandForm {
  brandName: string;
  slug: string;
  bornYear: string;
  introduction: string;
  heroImage: string;
  subImages: string[]; // max 5
  details: {
    brandName: string;
    timeFrame: string;
    role: string;
  };
}

const EMPTY_FORM: BrandForm = {
  brandName: "",
  slug: "",
  bornYear: "",
  introduction: "",
  heroImage: "",
  subImages: [],
  details: {
    brandName: "",
    timeFrame: "",
    role: "",
  },
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
            bornYear: data.bornYear ?? "",
            introduction: data.introduction ?? "",
            heroImage: data.heroImage ?? "",
            subImages: data.subImages ?? [],
            details: {
              brandName: data.details?.brandName ?? "",
              timeFrame: data.details?.timeFrame ?? "",
              role: data.details?.role ?? "",
            },
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

  function setDetail(key: keyof BrandForm["details"], value: string) {
    setForm((prev) => ({
      ...prev,
      details: { ...prev.details, [key]: value },
    }));
  }

  function handleNameChange(name: string) {
    setField("brandName", name);
    if (autoSlug) {
      setField("slug", slugify(name));
    }
    // also sync details.brandName
    setDetail("brandName", name);
  }

  function addSubImage(url: string) {
    setForm((prev) => ({
      ...prev,
      subImages: [...prev.subImages.slice(0, 4), url],
    }));
  }

  function removeSubImage(idx: number) {
    setForm((prev) => ({
      ...prev,
      subImages: prev.subImages.filter((_, i) => i !== idx),
    }));
  }

  function replaceSubImage(idx: number, url: string) {
    setForm((prev) => {
      const imgs = [...prev.subImages];
      imgs[idx] = url;
      return { ...prev, subImages: imgs };
    });
  }

  async function handleSave() {
    if (!form.brandName.trim()) return toast.error("Brand name is required");
    if (!form.slug.trim()) return toast.error("Slug is required");
    if (!form.heroImage) return toast.error("Hero image is required");

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
        description="Set up the brand hero, gallery images, and details"
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
          {/* Hero image */}
          <AdminCard>
            <p className="text-gray-900 font-semibold mb-4">Hero Image</p>
            <ImageUpload
              value={form.heroImage}
              onChange={(url) => setField("heroImage", url)}
              onRemove={() => setField("heroImage", "")}
              label="Main banner image (displayed at the top of the brand page)"
            />
          </AdminCard>

          {/* Sub images */}
          <AdminCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-900 font-semibold">Gallery Images</p>
                <p className="text-slate-500 text-xs mt-0.5">
                  Up to 5 images shown in the brand gallery
                </p>
              </div>
              <span className="text-slate-500 text-xs">
                {form.subImages.length}/5
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Existing sub images */}
              {form.subImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <ImageUpload
                    value={img}
                    onChange={(url) => replaceSubImage(idx, url)}
                    onRemove={() => removeSubImage(idx)}
                    label={`Image ${idx + 1}`}
                  />
                </div>
              ))}

              {/* Add slot — show only if < 5 */}
              {form.subImages.length < 5 && (
                <ImageUpload
                  value=""
                  onChange={addSubImage}
                  label={`Image ${form.subImages.length + 1}`}
                />
              )}
            </div>
          </AdminCard>
        </div>

        {/* ── Right column: text fields ─────────────────── */}
        <div className="space-y-6">
          {/* Basic info */}
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

              <AdminInput
                label="Born Year"
                placeholder="e.g. 2019"
                value={form.bornYear}
                onChange={(e) => setField("bornYear", e.target.value)}
              />
            </div>
          </AdminCard>

          {/* Introduction */}
          <AdminCard>
            <p className="text-gray-900 font-semibold mb-4">Introduction</p>
            <AdminTextarea
              label="Brand introduction paragraph"
              placeholder="Write a compelling introduction for this brand..."
              value={form.introduction}
              onChange={(e) => setField("introduction", e.target.value)}
              rows={5}
            />
          </AdminCard>

          {/* Details */}
          <AdminCard>
            <p className="text-gray-900 font-semibold mb-4">Details Panel</p>
            <div className="space-y-4">
              <AdminInput
                label="Brand Name (display)"
                placeholder="e.g. Tommee Tippee"
                value={form.details.brandName}
                onChange={(e) => setDetail("brandName", e.target.value)}
              />
              <AdminInput
                label="Time Frame"
                placeholder="e.g. Jan 2023 – Present"
                value={form.details.timeFrame}
                onChange={(e) => setDetail("timeFrame", e.target.value)}
              />
              <AdminInput
                label="Role"
                placeholder="e.g. Digital Marketing, Social Media"
                value={form.details.role}
                onChange={(e) => setDetail("role", e.target.value)}
              />
            </div>
          </AdminCard>

          {/* Save */}
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

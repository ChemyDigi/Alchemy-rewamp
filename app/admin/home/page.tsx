"use client";

import { useEffect, useState } from "react";
import { getHomeContent, updateHomeContent, HomeContent, ServiceImage, BrandLogo } from "@/lib/firestore";
import { PageHeader, AdminCard, AdminButton, AdminInput } from "@/components/admin/AdminUI";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import toast from "react-hot-toast";
import { Plus, Trash2, X, Save } from "lucide-react";

const emptyServiceImage = (): ServiceImage => ({ title: "", imageUrl: "", link: "", order: 0 });
const emptyBrandLogo = (): BrandLogo => ({ name: "", logoUrl: "", order: 0 });

export default function AdminHomePage() {
  const [serviceImages, setServiceImages] = useState<ServiceImage[]>([]);
  const [brandLogos, setBrandLogos] = useState<BrandLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteService, setDeleteService] = useState<number | null>(null);
  const [deleteLogo, setDeleteLogo] = useState<number | null>(null);

  useEffect(() => {
    getHomeContent().then((data) => {
      if (data) {
        setServiceImages(data.serviceImages ?? []);
        setBrandLogos(data.brandLogos ?? []);
      }
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await updateHomeContent({
        serviceImages: serviceImages.map((s, i) => ({ ...s, order: i })),
        brandLogos: brandLogos.map((b, i) => ({ ...b, order: i })),
      });
      toast.success("Home content updated");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  function updateServiceImage(idx: number, field: keyof ServiceImage, value: string) {
    setServiceImages((s) => s.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  }

  function updateBrandLogo(idx: number, field: keyof BrandLogo, value: string) {
    setBrandLogos((b) => b.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[#e3791d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Home Page Content"
        description="Manage service images and brand logos displayed on the homepage"
        action={
          <AdminButton variant="primary" size="md" onClick={handleSave} loading={saving}>
            <Save size={15} />
            Save Changes
          </AdminButton>
        }
      />

      {/* Service Images */}
      <AdminCard className="mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">Service Images</h2>
          <AdminButton variant="secondary" size="sm" onClick={() => setServiceImages((s) => [...s, emptyServiceImage()])}>
            <Plus size={13} />
            Add Service Image
          </AdminButton>
        </div>

        {serviceImages.length === 0 ? (
          <p className="text-slate-600 text-sm text-center py-6">No service images yet</p>
        ) : (
          <div className="space-y-4">
            {serviceImages.map((item, idx) => (
              <div key={idx} className="bg-[#080818] border border-[#1a1a35] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Service Image {idx + 1}</span>
                  <button onClick={() => setDeleteService(idx)} className="text-slate-500 hover:text-red-400 transition-colors">
                    <X size={15} />
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <AdminInput
                      label="Title"
                      placeholder="e.g. IT Solutions"
                      value={item.title}
                      onChange={(e) => updateServiceImage(idx, "title", e.target.value)}
                    />
                    <AdminInput
                      label="Link URL"
                      placeholder="e.g. /services-it"
                      value={item.link}
                      onChange={(e) => updateServiceImage(idx, "link", e.target.value)}
                    />
                  </div>
                  <ImageUpload
                    label="Service Image"
                    value={item.imageUrl}
                    onChange={(url) => updateServiceImage(idx, "imageUrl", url)}
                    onRemove={() => updateServiceImage(idx, "imageUrl", "")}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Brand Logos */}
      <AdminCard className="mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">Brand Logos</h2>
          <AdminButton variant="secondary" size="sm" onClick={() => setBrandLogos((b) => [...b, emptyBrandLogo()])}>
            <Plus size={13} />
            Add Brand Logo
          </AdminButton>
        </div>

        {brandLogos.length === 0 ? (
          <p className="text-slate-600 text-sm text-center py-6">No brand logos yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brandLogos.map((logo, idx) => (
              <div key={idx} className="bg-[#080818] border border-[#1a1a35] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Logo {idx + 1}</span>
                  <button onClick={() => setDeleteLogo(idx)} className="text-slate-500 hover:text-red-400 transition-colors">
                    <X size={15} />
                  </button>
                </div>
                <AdminInput
                  label="Brand Name"
                  placeholder="e.g. Acme Corp"
                  value={logo.name}
                  onChange={(e) => updateBrandLogo(idx, "name", e.target.value)}
                />
                <ImageUpload
                  label="Logo Image"
                  value={logo.logoUrl}
                  onChange={(url) => updateBrandLogo(idx, "logoUrl", url)}
                  onRemove={() => updateBrandLogo(idx, "logoUrl", "")}
                />
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Save button (bottom) */}
      <div className="flex gap-3 pb-6">
        <AdminButton variant="primary" size="lg" onClick={handleSave} loading={saving}>
          <Save size={15} />
          Save All Changes
        </AdminButton>
      </div>

      {/* Delete confirmations */}
      <ConfirmDialog
        open={deleteService !== null}
        title="Remove Service Image"
        message="Remove this service image from the homepage?"
        onConfirm={() => {
          if (deleteService !== null) {
            setServiceImages((s) => s.filter((_, i) => i !== deleteService));
            setDeleteService(null);
          }
        }}
        onCancel={() => setDeleteService(null)}
      />
      <ConfirmDialog
        open={deleteLogo !== null}
        title="Remove Brand Logo"
        message="Remove this brand logo from the homepage?"
        onConfirm={() => {
          if (deleteLogo !== null) {
            setBrandLogos((b) => b.filter((_, i) => i !== deleteLogo));
            setDeleteLogo(null);
          }
        }}
        onCancel={() => setDeleteLogo(null)}
      />
    </>
  );
}

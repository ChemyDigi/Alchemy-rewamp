"use client";

import { useEffect, useState } from "react";
import { getHomeContent, updateHomeContent, HomeContent, ServiceImage, BrandLogo, TrustedLogo, CarouselProject } from "@/lib/firestore";
import { PageHeader, AdminCard, AdminButton, AdminInput } from "@/components/admin/AdminUI";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import toast from "react-hot-toast";
import { Plus, Trash2, X, Save } from "lucide-react";

const emptyServiceImage = (): ServiceImage => ({ title: "", imageUrl: "", link: "", order: 0 });
const emptyBrandLogo = (): BrandLogo => ({ name: "", logoUrl: "", order: 0 });
const emptyTrustedLogo = (): TrustedLogo => ({ url: "", order: 0 });
const emptyCarouselProject = (): CarouselProject => ({ image: "", title: "", desc: "", order: 0 });

export default function AdminHomePage() {
  const [serviceImages, setServiceImages] = useState<ServiceImage[]>([]);
  const [brandLogos, setBrandLogos] = useState<BrandLogo[]>([]);
  const [watchReelUrl, setWatchReelUrl] = useState("");
  const [trustedLogos, setTrustedLogos] = useState<TrustedLogo[]>([]);
  const [carouselProjects, setCarouselProjects] = useState<CarouselProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingAll, setSavingAll] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [deleteService, setDeleteService] = useState<number | null>(null);
  const [deleteLogo, setDeleteLogo] = useState<number | null>(null);
  const [deleteTrustedLogo, setDeleteTrustedLogo] = useState<number | null>(null);
  const [deleteCarouselProject, setDeleteCarouselProject] = useState<number | null>(null);

  useEffect(() => {
    getHomeContent().then((data) => {
      if (data) {
        setServiceImages(data.serviceImages ?? []);
        setBrandLogos(data.brandLogos ?? []);
        setWatchReelUrl(data.watchReelUrl ?? "");
        setTrustedLogos(data.trustedLogos ?? []);
        setCarouselProjects(data.carouselProjects ?? []);
      }
      setLoading(false);
    });
  }, []);

  async function handleSaveAll() {
    setSavingAll(true);
    try {
      await updateHomeContent({
        watchReelUrl,
        trustedLogos: trustedLogos.map((t, i) => ({ ...t, order: i })),
        carouselProjects: carouselProjects.map((c, i) => ({ ...c, order: i })),
        serviceImages: serviceImages.map((s, i) => ({ ...s, order: i })),
        brandLogos: brandLogos.map((b, i) => ({ ...b, order: i })),
      });
      toast.success("All home content updated");
    } catch {
      toast.error("Save failed");
    } finally {
      setSavingAll(false);
    }
  }

  async function handleSaveSection(sectionName: string, data: Partial<HomeContent>) {
    setSavingSection(sectionName);
    try {
      await updateHomeContent(data);
      toast.success(`${sectionName} updated`);
    } catch {
      toast.error(`Failed to save ${sectionName}`);
    } finally {
      setSavingSection(null);
    }
  }

  function updateServiceImage(idx: number, field: keyof ServiceImage, value: string) {
    setServiceImages((s) => s.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  }

  function updateBrandLogo(idx: number, field: keyof BrandLogo, value: string) {
    setBrandLogos((b) => b.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  }

  function updateTrustedLogo(idx: number, field: keyof TrustedLogo, value: string) {
    setTrustedLogos((t) => t.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  }

  function updateCarouselProject(idx: number, field: keyof CarouselProject, value: string) {
    setCarouselProjects((c) => c.map((item, i) => i === idx ? { ...item, [field]: value } : item));
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
          <AdminButton variant="primary" size="md" onClick={handleSaveAll} loading={savingAll}>
            <Save size={15} />
            Save All
          </AdminButton>
        }
      />
      {/* Trusted Logos */}
      <AdminCard className="mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-gray-900 font-semibold">Trusted Company Logos</h2>
          <div className="flex gap-2">
            <AdminButton variant="secondary" size="sm" onClick={() => setTrustedLogos((t) => [...t, emptyTrustedLogo()])}>
              <Plus size={13} />
              Add Logo
            </AdminButton>
            <AdminButton variant="primary" size="sm" onClick={() => handleSaveSection("Trusted Logos", { trustedLogos: trustedLogos.map((t, i) => ({ ...t, order: i })) })} loading={savingSection === "Trusted Logos"}>
              <Save size={13} />
              Save Logos
            </AdminButton>
          </div>
        </div>

        {trustedLogos.length === 0 ? (
          <p className="text-slate-600 text-sm text-center py-6">No trusted logos yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trustedLogos.map((logo, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Logo {idx + 1}</span>
                  <button onClick={() => setDeleteTrustedLogo(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X size={15} />
                  </button>
                </div>
                <ImageUpload
                  label="Logo Image"
                  value={logo.url}
                  onChange={(url) => updateTrustedLogo(idx, "url", url)}
                  onRemove={() => updateTrustedLogo(idx, "url", "")}
                />
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Latest Projects Carousel */}
      <AdminCard className="mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-gray-900 font-semibold">Latest Projects (Carousel)</h2>
          <div className="flex gap-2">
            <AdminButton variant="secondary" size="sm" onClick={() => setCarouselProjects((c) => [...c, emptyCarouselProject()])}>
              <Plus size={13} />
              Add Project
            </AdminButton>
            <AdminButton variant="primary" size="sm" onClick={() => handleSaveSection("Carousel Projects", { carouselProjects: carouselProjects.map((c, i) => ({ ...c, order: i })) })} loading={savingSection === "Carousel Projects"}>
              <Save size={13} />
              Save Projects
            </AdminButton>
          </div>
        </div>

        {carouselProjects.length === 0 ? (
          <p className="text-slate-600 text-sm text-center py-6">No projects yet</p>
        ) : (
          <div className="space-y-4">
            {carouselProjects.map((item, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Project {idx + 1}</span>
                  <button onClick={() => setDeleteCarouselProject(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X size={15} />
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <AdminInput
                      label="Title"
                      placeholder="e.g. Project Name"
                      value={item.title}
                      onChange={(e) => updateCarouselProject(idx, "title", e.target.value)}
                    />
                    <AdminInput
                      label="Description"
                      placeholder="e.g. Beautiful scenic shot..."
                      value={item.desc}
                      onChange={(e) => updateCarouselProject(idx, "desc", e.target.value)}
                    />
                  </div>
                  <ImageUpload
                    label="Project Image"
                    value={item.image}
                    onChange={(url) => updateCarouselProject(idx, "image", url)}
                    onRemove={() => updateCarouselProject(idx, "image", "")}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Save button (bottom) */}
      <div className="flex gap-3 pb-6">
        <AdminButton variant="primary" size="lg" onClick={handleSaveAll} loading={savingAll}>
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
      <ConfirmDialog
        open={deleteTrustedLogo !== null}
        title="Remove Trusted Logo"
        message="Remove this logo from the homepage?"
        onConfirm={() => {
          if (deleteTrustedLogo !== null) {
            setTrustedLogos((t) => t.filter((_, i) => i !== deleteTrustedLogo));
            setDeleteTrustedLogo(null);
          }
        }}
        onCancel={() => setDeleteTrustedLogo(null)}
      />
      <ConfirmDialog
        open={deleteCarouselProject !== null}
        title="Remove Carousel Project"
        message="Remove this project from the carousel?"
        onConfirm={() => {
          if (deleteCarouselProject !== null) {
            setCarouselProjects((c) => c.filter((_, i) => i !== deleteCarouselProject));
            setDeleteCarouselProject(null);
          }
        }}
        onCancel={() => setDeleteCarouselProject(null)}
      />
    </>
  );
}

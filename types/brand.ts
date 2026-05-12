import { Timestamp } from "firebase/firestore";

export interface GalleryItem {
  id: number;
  src: string;
  className: string;
  type: "image" | "empty";
  alt: string;
  order: number;
}

export interface BrandDetails {
  brandName: string;
  timeFrame: string;
  role: string;
  industry?: string;
  services?: string[];
}

export interface Brand {
  id: string;
  slug: string;
  brandName: string;
  shortTitle: string;
  heroImage: string;
  logoImage: string;
  thumbnailImage: string;
  bornYear: string;
  introduction: string;
  details: BrandDetails;
  galleryTitle: string;
  gallery: GalleryItem[];
  featured: boolean;
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BrandFormData {
  brandName: string;
  slug: string;
  shortTitle: string;
  bornYear: string;
  introduction: string;
  heroImage?: string | File;
  logoImage?: string | File;
  thumbnailImage?: string | File;
  galleryTitle: string;
  gallery: GalleryItem[];
  details: {
    brandName: string;
    timeFrame: string;
    role: string;
    industry: string;
    services: string[];
  };
  featured: boolean;
  isPublished: boolean;
}

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import { Brand, BrandFormData } from "@/types/brand";

const BRANDS_COLLECTION = "brands";

/**
 * Fetch all published brands with optional featured filter
 */
export async function getPublishedBrands(
  featuredOnly: boolean = false
): Promise<Brand[]> {
  try {
    const constraints: QueryConstraint[] = [
      where("isPublished", "==", true),
    ];

    if (featuredOnly) {
      constraints.push(where("featured", "==", true));
    }

    const q = query(collection(db, BRANDS_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    } as Brand));
  } catch (error) {
    console.error("Error fetching published brands:", error);
    throw error;
  }
}

/**
 * Fetch all brands (admin)
 */
export async function getAllBrands(): Promise<Brand[]> {
  try {
    const q = query(collection(db, BRANDS_COLLECTION));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    } as Brand));
  } catch (error) {
    console.error("Error fetching all brands:", error);
    throw error;
  }
}

/**
 * Fetch a single brand by ID
 */
export async function getBrandById(brandId: string): Promise<Brand | null> {
  try {
    const docRef = doc(db, BRANDS_COLLECTION, brandId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      ...docSnap.data(),
      id: docSnap.id,
    } as Brand;
  } catch (error) {
    console.error("Error fetching brand by ID:", error);
    throw error;
  }
}

/**
 * Fetch a single brand by slug
 */
export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  try {
    const q = query(collection(db, BRANDS_COLLECTION), where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      ...doc.data(),
      id: doc.id,
    } as Brand;
  } catch (error) {
    console.error("Error fetching brand by slug:", error);
    throw error;
  }
}

/**
 * Create a new brand
 */
export async function createBrand(brandData: Omit<BrandFormData, "id">): Promise<string> {
  try {
    const now = Timestamp.now();

    const data = {
      ...brandData,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, BRANDS_COLLECTION), data);
    return docRef.id;
  } catch (error) {
    console.error("Error creating brand:", error);
    throw error;
  }
}

/**
 * Update an existing brand
 */
export async function updateBrand(
  brandId: string,
  brandData: Partial<BrandFormData>
): Promise<void> {
  try {
    const docRef = doc(db, BRANDS_COLLECTION, brandId);

    const data = {
      ...brandData,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating brand:", error);
    throw error;
  }
}

/**
 * Delete a brand
 */
export async function deleteBrand(brandId: string): Promise<void> {
  try {
    const docRef = doc(db, BRANDS_COLLECTION, brandId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting brand:", error);
    throw error;
  }
}

/**
 * Check if slug already exists
 */
export async function isSlugExists(slug: string, excludeId?: string): Promise<boolean> {
  try {
    const q = query(collection(db, BRANDS_COLLECTION), where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return false;
    }

    if (excludeId) {
      return snapshot.docs.some((doc) => doc.id !== excludeId);
    }

    return true;
  } catch (error) {
    console.error("Error checking slug:", error);
    throw error;
  }
}

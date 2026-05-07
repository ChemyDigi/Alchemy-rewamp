import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BlogSection {
  heading: string;
  description: string;
  image?: string;
}

export interface Blog {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  featuredImage: string;
  content: string;
  sections: BlogSection[];
  galleryImages: string[];
  status: "draft" | "published";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface GalleryItem {
  id?: string;
  title: string;
  imageUrl: string;
  order: number;
  createdAt?: Timestamp;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  imageUrl: string;
  order: number;
  createdAt?: Timestamp;
}

export interface ServiceImage {
  title: string;
  imageUrl: string;
  link: string;
  order: number;
}

export interface BrandLogo {
  name: string;
  logoUrl: string;
  order: number;
}

export interface HomeContent {
  serviceImages: ServiceImage[];
  brandLogos: BrandLogo[];
  updatedAt?: Timestamp;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  createdAt?: Timestamp;
}

export interface Service {
  id?: string;
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  projects: Project[];
  updatedAt?: Timestamp;
}

// ─── Blog CRUD ────────────────────────────────────────────────────────────────

export async function getBlogs(): Promise<Blog[]> {
  const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Blog));
}

export async function getPublishedBlogs(): Promise<Blog[]> {
  const q = query(
    collection(db, "blogs"),
    where("status", "==", "published"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Blog));
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const q = query(collection(db, "blogs"), where("slug", "==", slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() } as Blog;
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const d = await getDoc(doc(db, "blogs", id));
  if (!d.exists()) return null;
  return { id: d.id, ...d.data() } as Blog;
}

export async function createBlog(data: Omit<Blog, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "blogs"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateBlog(id: string, data: Partial<Blog>): Promise<void> {
  await updateDoc(doc(db, "blogs", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBlog(id: string): Promise<void> {
  await deleteDoc(doc(db, "blogs", id));
}

// ─── Gallery CRUD ─────────────────────────────────────────────────────────────

export async function getGallery(): Promise<GalleryItem[]> {
  const q = query(collection(db, "gallery"), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryItem));
}

export async function createGalleryItem(
  data: Omit<GalleryItem, "id">
): Promise<string> {
  const ref = await addDoc(collection(db, "gallery"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateGalleryItem(
  id: string,
  data: Partial<GalleryItem>
): Promise<void> {
  await updateDoc(doc(db, "gallery", id), data);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await deleteDoc(doc(db, "gallery", id));
}

// ─── Team CRUD ────────────────────────────────────────────────────────────────

export async function getTeam(): Promise<TeamMember[]> {
  const q = query(collection(db, "team"), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as TeamMember));
}

export async function createTeamMember(
  data: Omit<TeamMember, "id">
): Promise<string> {
  const ref = await addDoc(collection(db, "team"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateTeamMember(
  id: string,
  data: Partial<TeamMember>
): Promise<void> {
  await updateDoc(doc(db, "team", id), data);
}

export async function deleteTeamMember(id: string): Promise<void> {
  await deleteDoc(doc(db, "team", id));
}

// ─── Home Content ─────────────────────────────────────────────────────────────

export async function getHomeContent(): Promise<HomeContent | null> {
  const d = await getDoc(doc(db, "homeContent", "main"));
  if (!d.exists()) return null;
  return d.data() as HomeContent;
}

export async function updateHomeContent(data: Partial<HomeContent>): Promise<void> {
  await updateDoc(doc(db, "homeContent", "main"), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ─── Services CRUD ────────────────────────────────────────────────────────────

export async function getServices(): Promise<Service[]> {
  const snapshot = await getDocs(collection(db, "services"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Service));
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const q = query(collection(db, "services"), where("slug", "==", slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() } as Service;
}

export async function upsertService(data: Service): Promise<void> {
  const q = query(collection(db, "services"), where("slug", "==", data.slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    await addDoc(collection(db, "services"), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } else {
    await updateDoc(doc(db, "services", snapshot.docs[0].id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }
}

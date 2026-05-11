import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Blog {
  id?: string;
  title: string;
  slug: string;
  subtitle?: string;
  author?: string;
  date?: string;
  readTime?: string;
  featuredImage: string;
  content: string;
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

export interface CarouselProject {
  id?: string;
  image: string;
  title: string;
  desc: string;
  order: number;
}

export interface TrustedLogo {
  id?: string;
  url: string;
  order: number;
}

export interface HomeContent {
  watchReelUrl?: string;
  trustedLogos?: TrustedLogo[];
  carouselProjects?: CarouselProject[];
  serviceImages?: ServiceImage[];
  brandLogos?: BrandLogo[];
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

export interface DMPost {
  id: string;
  imageUrl: string;
  alt: string;
  aspect: "square" | "tall";
}

export interface Service {
  id?: string;
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  projects: Project[];
  dmPosts?: DMPost[];
  updatedAt?: Timestamp;
}

// ─── Blog CRUD ────────────────────────────────────────────────────────────────

export async function getBlogs(): Promise<Blog[]> {
  const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Blog));
}

export async function getPublishedBlogs(): Promise<Blog[]> {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) return [];
    
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/blogs`;
    const response = await fetch(url, { cache: 'no-store' });
    
    if (!response.ok) return [];
    const data = await response.json();
    if (!data.documents) return [];
    
    const blogs: Blog[] = data.documents.map((doc: any) => {
      const id = doc.name.split('/').pop();
      const fields = doc.fields || {};
      return {
        id,
        title: fields.title?.stringValue || "",
        slug: fields.slug?.stringValue || "",
        subtitle: fields.subtitle?.stringValue || "",
        author: fields.author?.stringValue || "",
        date: fields.date?.stringValue || "",
        readTime: fields.readTime?.stringValue || "",
        featuredImage: fields.featuredImage?.stringValue || "",
        content: fields.content?.stringValue || "",
        status: fields.status?.stringValue || "draft",
        createdAt: { seconds: new Date(doc.createTime || 0).getTime() / 1000 },
      } as Blog;
    });

    // Sort descending by date
    blogs.sort((a: Blog, b: Blog) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });

    // In production, you might want to filter by status === "published" here, 
    // but we will return all for now or just filter published.
    return blogs.filter(b => b.status === "published");
  } catch (error) {
    console.error("REST API fetch error:", error);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const blogs = await getPublishedBlogs();
  const blog = blogs.find((b) => b.slug === slug);
  return blog || null;
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
  await setDoc(doc(db, "homeContent", "main"), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
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

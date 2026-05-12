/**
 * Uploads a file to Cloudinary using the unsigned upload preset.
 * Returns the secure URL of the uploaded image.
 * All upload logic stays client-side — no secret key is exposed.
 * 
 * @param file - The file to upload
 * @param folder - The Cloudinary folder path (e.g., "brands/hero", "brands/logo")
 * @returns The secure URL of the uploaded image
 */
export async function uploadToCloudinary(
  file: File,
  folder: "brands/hero" | "brands/logo" | "brands/thumbnail" | "brands/gallery" = "brands/gallery"
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary environment variables are not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Upload failed");
  }

  const data = await res.json();
  return data.secure_url as string;
}

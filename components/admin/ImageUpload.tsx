"use client";

import { useState, useRef } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Upload, X, RefreshCw, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  label = "Upload Image",
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-gray-600 text-sm font-medium">{label}</label>
      )}

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 group shadow-sm">
          {/* Preview */}
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 shadow-md"
            >
              {uploading ? (
                <RefreshCw size={13} className="animate-spin" />
              ) : (
                <RefreshCw size={13} />
              )}
              Replace
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-md"
              >
                <X size={13} />
                Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !uploading && inputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 hover:border-[#e3791d]/60 hover:bg-orange-50/30 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 group min-h-[160px] bg-gray-50"
        >
          {uploading ? (
            <>
              <div className="w-10 h-10 border-2 border-[#e3791d] border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-sm font-medium">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center group-hover:border-[#e3791d]/40 group-hover:bg-orange-50 transition-all shadow-sm">
                <Upload size={20} className="text-gray-300 group-hover:text-[#e3791d] transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm font-semibold">
                  Drop image or <span className="text-[#e3791d]">click to browse</span>
                </p>
                <p className="text-gray-400 text-xs mt-1">PNG, JPG, WebP up to 10MB</p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}

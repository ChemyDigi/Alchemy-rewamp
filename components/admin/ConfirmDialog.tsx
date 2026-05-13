"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title = "Confirm Action",
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white border border-gray-100 rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-black/10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
        >
          <X size={16} />
        </button>
        <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center mb-4">
          <AlertTriangle size={20} className="text-red-500" />
        </div>
        <h3 className="text-gray-900 font-bold text-base mb-1.5">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-red-200"
          >
            {loading && (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

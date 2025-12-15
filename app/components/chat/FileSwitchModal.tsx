"use client";

import { useState } from "react";

type FileSwitchModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (fileId: string, fileVersion?: string) => Promise<void>;
};

export function FileSwitchModal({ open, onClose, onConfirm }: FileSwitchModalProps) {
  const [fileId, setFileId] = useState("");
  const [fileVersion, setFileVersion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleConfirm() {
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(fileId.trim(), fileVersion.trim() || undefined);
    } catch (e: any) {
      setError(e?.message || "İşlem başarısız.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
        <div className="text-sm font-semibold text-slate-100">Dosya Değiştir</div>
        <p className="mt-1 text-xs text-slate-400">
          Yeni dosya seçimi mevcut sohbeti sıfırlar ve yeni bir context oluşturur.
        </p>
        <div className="mt-3 space-y-2">
          <label className="text-xs text-slate-300">
            Dosya ID
            <input
              value={fileId}
              onChange={(e) => setFileId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500/50"
              placeholder="file_id"
              disabled={submitting}
            />
          </label>
          <label className="text-xs text-slate-300">
            Dosya versiyonu (opsiyonel)
            <input
              value={fileVersion}
              onChange={(e) => setFileVersion(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500/50"
              placeholder="timestamp veya versiyon"
              disabled={submitting}
            />
          </label>
        </div>
        {error && <div className="mt-2 rounded-lg border border-rose-500/40 bg-rose-500/10 p-2 text-xs text-rose-200">{error}</div>}
        <div className="mt-4 flex justify-end gap-2 text-sm">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-200 hover:bg-slate-800"
            disabled={submitting}
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 font-semibold text-emerald-100 hover:bg-emerald-500/20 disabled:opacity-50"
            disabled={submitting || !fileId.trim()}
          >
            {submitting ? "Değiştiriliyor..." : "Dosya Değiştir"}
          </button>
        </div>
      </div>
    </div>
  );
}

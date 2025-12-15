"use client";

import { FileSwitchModal } from "./FileSwitchModal";
import { useState } from "react";
import { ContextInfo } from "@/app/hooks/useContextSwitch";

type ChatHeaderProps = {
  context?: ContextInfo | null;
  onContextChange: (fileId: string, fileVersion?: string) => Promise<void>;
  busy?: boolean;
};

export function ChatHeader({ context, onContextChange, busy = false }: ChatHeaderProps) {
  const [open, setOpen] = useState(false);

  const fileLabel = context?.fileName || "Bağlı dosya yok";
  const ts = context?.createdAt ? new Date(context.createdAt) : null;
  const tsLabel = ts ? ts.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" }) : "";

  return (
    <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-emerald-400/60 bg-emerald-500/10 text-[11px] text-emerald-200">
            📊
          </span>
          <span className="truncate max-w-[240px]" title={fileLabel}>
            {fileLabel}
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          {tsLabel ? `${tsLabel} güncellendi` : "Dosya seçin"}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={busy}
        className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/15 disabled:opacity-50"
      >
        Dosya Değiştir
      </button>

      {open && (
        <FileSwitchModal
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={async (fileId, fileVersion) => {
            await onContextChange(fileId, fileVersion);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

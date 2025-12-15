"use client";

import { useState } from "react";

export type ContextInfo = {
  contextId: string;
  fileId: string;
  fileName: string;
  createdAt?: string;
};

export function useContextSwitch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createContext(fileId: string, fileVersion?: string): Promise<ContextInfo | null> {
    if (!fileId.trim()) {
      setError("Dosya ID gerekli.");
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/agent/context/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ file_id: fileId, file_version: fileVersion }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        setError(t || "Context oluşturulamadı.");
        return null;
      }
      const data = await res.json();
      const file = data.file || {};
      return {
        contextId: data.context_id,
        fileId: file.id || fileId,
        fileName: file.name || "Dosya",
        createdAt: file.created_at,
      };
    } catch {
      setError("Bağlantı hatası. Tekrar deneyin.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { createContext, loading, error };
}

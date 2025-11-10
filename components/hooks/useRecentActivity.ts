import { useEffect, useState } from "react";

export type RecentItem = {
  id?: string | number;
  source_file?: string;
  original_filename?: string;
  file_type?: string;
  status?: string;
  created_at?: string;
  finished_at?: string;
  row_count?: number;
  // Backend'de ekstra ne varsa buraya ekleyebilirsin.
};

type UseRecentActivityState = {
  loading: boolean;
  error: string | null;
  items: RecentItem[];
};

/**
 * BotExcel backend'inde login olan kullanıcı için /recent.json endpoint'ini okur.
 *
 * Notlar:
 * - Backend ile frontend aynı origin'de (reverse proxy) ise sadece "/recent.json" yeterli.
 * - Eğer backend başka bir origin'de ise, burada tam URL ve CORS ayarları gerekir.
 */
export function useRecentActivity(limit: number = 10): UseRecentActivityState {
  const [state, setState] = useState<UseRecentActivityState>({
    loading: true,
    error: null,
    items: [],
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchRecent() {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const url = `/recent.json?limit=${encodeURIComponent(String(limit))}`;
        const res = await fetch(url, {
          // same-origin cookie'lerle çalışacağız; session cookie'leri böylece gider.
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            // Login değilse ya da plan limiti doluysa:
            const text = await res.text();
            if (!cancelled) {
              setState({
                loading: false,
                error: `Yetki / kota hatası: ${text || res.statusText}`,
                items: [],
              });
            }
            return;
          }

          throw new Error(`İstek başarısız: ${res.status} ${res.statusText}`);
        }

        const json = await res.json();

        // Backend'in şemasına göre esnek bir okuma:
        const raw =
          (json && (json.items || json.jobs || json.data)) ??
          (Array.isArray(json) ? json : []);

        const items: RecentItem[] = Array.isArray(raw)
          ? raw
          : [];

        if (!cancelled) {
          setState({
            loading: false,
            error: null,
            items,
          });
        }
      } catch (err: any) {
        if (cancelled) return;
        setState({
          loading: false,
          error: err?.message || "Bilinmeyen bir hata oluştu.",
          items: [],
        });
      }
    }

    fetchRecent();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return state;
}

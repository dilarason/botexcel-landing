"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChatHeader } from "@/app/components/chat/ChatHeader";
import { useContextSwitch, ContextInfo } from "@/app/hooks/useContextSwitch";
import { SourceSection } from "@/app/components/chat/SourceSection";

type Role = "user" | "assistant" | "system";
type Source = { sheet_name?: string; cell_range?: string; row_count?: number; label?: string };
type ChatMessage = { id: string; role: Role; content: string; ts: number; sources?: Source[]; file_version?: string };

type ChatSession = {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
};

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString();
}

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const initial: ChatSession = {
      id: uid(),
      title: "Yeni sohbet",
      updatedAt: Date.now(),
      messages: [
        {
          id: uid(),
          role: "assistant",
          content:
            "BotExcel Chat hazır. Belgenin bağlamını yaz veya dönüşüm hedefini söyle (örn: 'Bu PDF’te KDV hariç toplamı bul, tabloyu normalize et').",
          ts: Date.now(),
        },
      ],
    };
    return [initial];
  });

  const [activeId, setActiveId] = useState<string>(() => sessions[0]?.id ?? "");
  const active = useMemo(
    () => sessions.find((s) => s.id === activeId) ?? sessions[0],
    [sessions, activeId],
  );

  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [context, setContext] = useState<ContextInfo | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { createContext, loading: contextLoading } = useContextSwitch();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length, isStreaming]);

  function updateActive(mutator: (s: ChatSession) => ChatSession) {
    setSessions((prev) =>
      prev.map((s) => (s.id === active.id ? mutator(s) : s)).sort((a, b) => b.updatedAt - a.updatedAt),
    );
  }

  function newSession() {
    const s: ChatSession = {
      id: uid(),
      title: "Yeni sohbet",
      updatedAt: Date.now(),
      messages: [
        {
          id: uid(),
          role: "assistant",
          content: "Yeni sohbet açıldı. Ne yapmak istiyorsun?",
          ts: Date.now(),
        },
      ],
    };
    setSessions((p) => [s, ...p]);
    setActiveId(s.id);
  }

  async function send() {
    const text = input.trim();
    if (!text || !active || isStreaming) return;

    setStreamError(null);
    setInput("");

    const userMsg: ChatMessage = { id: uid(), role: "user", content: text, ts: Date.now() };
    const assistantMsg: ChatMessage = { id: uid(), role: "assistant", content: "", ts: Date.now() };

    updateActive((s) => ({
      ...s,
      title: s.title === "Yeni sohbet" ? text.slice(0, 40) : s.title,
      updatedAt: Date.now(),
      messages: [...s.messages, userMsg, assistantMsg],
    }));

    const controller = new AbortController();
    abortRef.current = controller;
    setIsStreaming(true);

    try {
      const payload = {
        session_id: active.id,
        messages: [...active.messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        context_id: context?.contextId,
      };

        const res = await fetch("/api/chat/stream", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

      if (!res.ok || !res.body) {
        const t = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${t}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      // SSE satırlarını parse ediyoruz: "data: {...}\n\n"
      let buffer = "";
      let finalText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE event ayır
        let idx;
        while ((idx = buffer.indexOf("\n\n")) !== -1) {
          const chunk = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);

          const lines = chunk.split("\n");
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (!data) continue;
            if (data === "[DONE]") {
              buffer = "";
              break;
            }
            // data JSON: { token?: string, text?: string, error?: string, sources?: Source[], file_version?: string }
            try {
              const obj = JSON.parse(data) as {
                token?: string;
                text?: string;
                error?: string;
                sources?: Source[];
                file_version?: string;
              };
              if (obj.error) throw new Error(obj.error);
              const piece = obj.token ?? obj.text ?? "";
              if (piece) {
                finalText += piece;
                updateActive((s) => {
                  const msgs = [...s.messages];
                  const last = msgs[msgs.length - 1];
                  if (!last || last.id !== assistantMsg.id) return s;
                  msgs[msgs.length - 1] = {
                    ...last,
                    content: finalText,
                    sources: obj.sources ?? last.sources,
                    file_version: obj.file_version ?? last.file_version,
                  };
                  return { ...s, updatedAt: Date.now(), messages: msgs };
                });
              }
              if (obj.sources && obj.sources.length) {
                updateActive((s) => {
                  const msgs = [...s.messages];
                  const last = msgs[msgs.length - 1];
                  if (!last || last.id !== assistantMsg.id) return s;
                  msgs[msgs.length - 1] = {
                    ...last,
                    sources: obj.sources,
                    file_version: obj.file_version ?? last.file_version,
                  };
                  return { ...s, messages: msgs, updatedAt: Date.now() };
                });
              }
            } catch {
              // JSON değilse düz metin kabul et
              finalText += data;
              updateActive((s) => {
                const msgs = [...s.messages];
                const last = msgs[msgs.length - 1];
                if (!last || last.id !== assistantMsg.id) return s;
                msgs[msgs.length - 1] = { ...last, content: finalText };
                return { ...s, updatedAt: Date.now(), messages: msgs };
              });
            }
          }
        }
      }
    } catch (e: unknown) {
      setStreamError(e instanceof Error ? e.message : "Stream error");
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }

  async function handleContextChange(fileId: string, fileVersion?: string) {
    const nextContext = await createContext(fileId, fileVersion);
    if (!nextContext) return;
    setContext(nextContext);
    // sohbeti temizle ve yeni başlat
    const s: ChatSession = {
      id: uid(),
      title: nextContext.fileName || "Yeni sohbet",
      updatedAt: Date.now(),
      messages: [
        {
          id: uid(),
          role: "assistant",
          content: `${nextContext.fileName} için yeni bir sohbet başlatıldı.`,
          ts: Date.now(),
        },
      ],
    };
    setSessions([s]);
    setActiveId(s.id);
  }

  return (
    <div className="min-h-[100vh] bg-slate-950 text-slate-100">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-semibold">Sohbetler</div>
            <button
              onClick={newSession}
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200 hover:bg-emerald-500/15"
            >
              + Yeni
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={`w-full rounded-xl border px-3 py-2 text-left text-xs transition ${
                  s.id === active.id
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-slate-800 bg-slate-950/30 hover:bg-slate-900/40"
                }`}
              >
                <div className="truncate font-medium">{s.title}</div>
                <div className="mt-1 text-[10px] text-slate-400">{formatTime(s.updatedAt)}</div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="rounded-2xl border border-slate-800 bg-slate-950/60">
          <ChatHeader context={context} onContextChange={handleContextChange} busy={isStreaming || contextLoading} />
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <div className="text-sm font-semibold">{active.title}</div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              {isStreaming ? (
                <>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span>model yazıyor…</span>
                  <button
                    onClick={stop}
                    className="ml-2 rounded-lg border border-slate-700 bg-slate-900/60 px-2 py-1 text-[11px] hover:bg-slate-900"
                  >
                    Durdur
                  </button>
                </>
              ) : (
                <span>local model</span>
              )}
            </div>
          </div>

          <div className="h-[65vh] overflow-y-auto px-4 py-4">
            <div className="space-y-3">
              {active.messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[85%] rounded-2xl border px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto border-emerald-500/35 bg-emerald-500/10 text-emerald-50"
                      : "mr-auto border-slate-700/70 bg-slate-900/70 text-slate-100"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  {m.role === "assistant" && (
                    <SourceSection
                      sources={m.sources}
                      fileVersionLabel={m.file_version ? `Versiyon: ${m.file_version}` : undefined}
                    />
                  )}
                </div>
              ))}
              {streamError && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200">
                  Stream hata: {streamError}
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="border-t border-slate-800 p-4">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Mesaj yaz… (Enter: gönder, Shift+Enter: yeni satır)"
                className="min-h-[44px] flex-1 resize-none rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-emerald-500/40"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
              />
              <button
                onClick={() => void send()}
                disabled={isStreaming || !input.trim()}
                className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm text-emerald-100 disabled:opacity-50"
              >
                Gönder
              </button>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Bu ekran MVP. Sonraki adım: dosya bağlamı (upload seçimi), chat hafızası (persist), prompt policy.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

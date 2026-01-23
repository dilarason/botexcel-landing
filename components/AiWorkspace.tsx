"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";

type ChatSessionSummary = {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
};

type ChatMessage = {
  id: number;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  return isNaN(date.getTime())
    ? value
    : date.toLocaleString("tr-TR", { hour12: false });
};

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("botexcel_token") : null;

const buildHeaders = (json = true) => {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (json) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

export default function AiWorkspace() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("Bekleniyor");
  const [isBusy, setIsBusy] = useState(false);
  const [latestDownloadUrl, setLatestDownloadUrl] = useState<string | null>(
    null
  );

  const selectSession = useCallback(async (sessionId: number) => {
    setActiveId(sessionId);
    setMessages([]);
    setStatus("Geçmiş yükleniyor...");
    try {
      const resp = await fetch(`/api/chat/history/${sessionId}`, {
        headers: buildHeaders(),
      });
      const data = await resp.json();
      if (!data.error) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("history load error", error);
      setStatus("Hata: Geçmiş yüklenemedi.");
    }
  }, []);

  const loadSessions = useCallback(
    async (focusId?: number) => {
      try {
        const resp = await fetch("/api/chat/sessions", {
          headers: buildHeaders(),
        });
        const data = await resp.json();
        if (!data.error) {
          setSessions(data.sessions || []);
          if (focusId) {
            setActiveId(focusId);
          } else if (!activeId && data.sessions && data.sessions.length) {
            selectSession(data.sessions[0].id);
          }
        }
      } catch (error) {
        console.error("session load error", error);
      }
    },
    [activeId, selectSession]
  );

  const sendMessage = async (text: string, role: "user" | "assistant" | "system" = "user") => {
    if (!text.trim()) return;
    setStatus("BotExcel.AI yazıyor...");
    setIsBusy(true);
    const optimistic: ChatMessage = {
      id: Date.now(),
      role,
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify({
          message: text,
          session_id: activeId,
          role,
        }),
      });
      const data = await resp.json();
      setIsBusy(false);
      if (data.error) {
        setStatus(data.message || "Bot cevap veremedi.");
        return;
      }
      if (!activeId || activeId !== data.session_id) {
        setActiveId(data.session_id);
      }
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: data.answer,
          created_at: new Date().toISOString(),
        },
      ]);
      if (data.title) {
        setSessions((prev) =>
          prev.map((session) =>
            session.id === data.session_id
              ? { ...session, title: data.title, updated_at: new Date().toISOString() }
              : session
          )
        );
      }
      await loadSessions(data.session_id);
      await selectSession(data.session_id);
      setStatus("Hazır");
    } catch (error) {
      setIsBusy(false);
      console.error("chat send error", error);
      setStatus("Sunucuya bağlanılamadı.");
    }
  };

  const handleSendClick = () => {
    if (!input.trim() || isBusy) return;
    const text = input;
    setInput("");
    sendMessage(text);
  };

  const handleFileInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setLatestDownloadUrl(null);
    setIsBusy(true);
    setStatus("Dosya işleniyor...");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const tokenHeader = getToken();
      const convertHeaders: Record<string, string> = {};
      if (tokenHeader) {
        convertHeaders.Authorization = `Bearer ${tokenHeader}`;
      }
      const resp = await fetch("/api/convert", {
        method: "POST",
        headers: convertHeaders,
        body: formData,
      });
      const data = await resp.json();
      if (!data.error && data.download_url) {
        setLatestDownloadUrl(data.download_url);
        await sendMessage(
          `Dosya ${file.name} başarıyla işlendi. İndir: ${data.download_url}`,
          "system"
        );
        setStatus("Dosya sohbetine eklendi.");
      } else {
        setStatus(data.message || "Dosya işlenemedi.");
      }
    } catch (error) {
      console.error("convert error", error);
      setStatus("Dosya yüklenirken hata oluştu.");
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-center shadow-xl shadow-black/40 md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-1">
              <Image
                src="/botexcel-logo.svg"
                alt="BotExcel"
                fill
                className="rounded-xl object-cover"
                sizes="40px"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">
                BotExcel.AI
              </p>
              <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
                Chat tabanlı dönüşüm
              </h1>
            </div>
          </div>
          <p className="text-sm text-slate-300 max-w-2xl">
            Hem dosya dönüşümünü hem de genel sohbet geçmişini aynı panelde yönetin.
            BotExcel.AI ile sohbet ederken her mesaj kaydedilir ve geçmiş sohbetlere
            kolayca dönebilirsiniz.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
          <aside className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/40">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-100">Dosya + sohbet</h2>
                <button
                  onClick={() => {
                    setActiveId(null);
                    setMessages([]);
                    setLatestDownloadUrl(null);
                    setStatus("Yeni sohbet");
                  }}
                  className="rounded-full border border-emerald-500/60 px-3 py-1 text-[11px] font-semibold text-emerald-300 transition hover:border-emerald-400"
                >
                  Yeni sohbet
                </button>
              </div>
              <label className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 px-4 py-6 text-center text-sm text-slate-300 transition hover:border-emerald-400">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileInput}
                />
                <span className="block text-xs uppercase tracking-[0.4em] text-slate-500">
                  Dosya seç
                </span>
                <strong className="text-sm font-semibold text-slate-50">
                  Drag & drop veya gözat.
                </strong>
                <p className="mt-2 text-[11px] text-slate-500">
                  PDF, IMG, CSV, DOCX, XLSX desteklenir (max 20 MB).
                </p>
              </label>
            </div>

            <div className="space-y-3 overflow-y-auto text-[11px]">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => selectSession(session.id)}
                  className={`block w-full rounded-2xl px-3 py-2 text-left transition ${
                    activeId === session.id
                      ? "border border-emerald-400 bg-emerald-500/10"
                      : "border border-slate-800 bg-slate-950/60 hover:border-slate-600"
                  }`}
                >
                  <p className="truncate font-semibold text-slate-50">
                    {session.title}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Güncellendi: {formatDate(session.updated_at)}
                  </p>
                </button>
              ))}
              {!sessions.length && (
                <p className="text-[11px] text-slate-500">Henüz sohbet yok.</p>
              )}
            </div>
          </aside>

          <article className="flex min-h-[400px] flex-col rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-lg shadow-black/40">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">
                  {activeId ? "Aktif sohbet" : "Boş sohbet"}
                </p>
                <p className="text-sm font-semibold text-slate-50">
                  {status}
                </p>
              </div>
              <span className="text-[11px] text-slate-500">
                {messages.length} mesaj
              </span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-3 text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="relative flex"
                  style={{ justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-emerald-500/20 text-emerald-200"
                        : msg.role === "assistant"
                        ? "bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 shadow-[0_0_25px_rgba(0,0,0,0.35)]"
                        : "bg-slate-800/60 text-slate-300"
                    }`}
                  >
                    {msg.content}
                    <div className="mt-1 text-[9px] text-slate-500">
                      {formatDate(msg.created_at)}
                    </div>
                  </div>
                </div>
              ))}
              {isBusy && (
                <div className="text-xs text-slate-400">BotExcel.AI yazıyor…</div>
              )}
            </div>

            {latestDownloadUrl && (
              <div className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-[12px] text-emerald-100">
                <p>Son dosyanız hazır:</p>
                <a
                  href={latestDownloadUrl}
                  className="text-sm font-semibold text-emerald-200 hover:text-emerald-100"
                >
                  Excel’i indir
                </a>
              </div>
            )}

            <div className="mt-4 border-t border-slate-800 pt-3">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSendClick();
                    }
                  }}
                  className="flex-1 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-50 focus:border-emerald-500 focus:outline-none"
                  placeholder="BotExcel.AI'ye mesaj yaz..."
                />
                <button
                  disabled={isBusy}
                  onClick={handleSendClick}
                  className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
                >
                  Gönder
                </button>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

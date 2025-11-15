"use client";

import React, { useRef, useState } from "react";

type AiMessage = {
  role: "system" | "assistant" | "user";
  text: string;
};

type AiQuestion = {
  id: string;
  prompt: string;
  options?: string[];
};

type Preview = {
  rows: Array<{ Key: string; Value: string }>;
  detected: {
    total_candidates: string[];
    date_candidates: string[];
    currency_guess: string;
  };
};

export default function AiWorkspace() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [questions, setQuestions] = useState<AiQuestion[]>([]);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const appendMessage = (message: AiMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleFileInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    fileInputRef.current!.value = "";
    appendMessage({
      role: "system",
      text: `“${file.name}” dosyasını BotExcel.AI’ye gönderiyorum...`,
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", "ai");

    setIsBusy(true);
    try {
      const response = await fetch("/api/ai-convert/start", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setIsBusy(false);

      if (!data.ok) {
        appendMessage({
          role: "assistant",
          text:
            data.message ||
            "Dönüşüm başlatılamadı, bilgileri kontrol edip tekrar deneyin.",
        });
        return;
      }

      setSessionId(data.session_id);
      setPreview(data.preview ?? null);
      setStatus(data.status ?? null);
      setDownloadUrl(null);
      appendMessage({
        role: "assistant",
        text: data.questions?.length
          ? "Analiz ettim. Sana birkaç soru soracağım."
          : "Dosyan hazırsa hemen Excel’i hazırlıyorum.",
      });
      setQuestions(data.questions ?? []);
      if (data.status === "ready" && data.download_url) {
        setDownloadUrl(data.download_url);
        appendMessage({
          role: "assistant",
          text: "Excel dosyan hazır. İndir butonuna tıkla.",
        });
      }
    } catch (error) {
      setIsBusy(false);
      console.error("AI start error:", error);
      appendMessage({
        role: "assistant",
        text: "Dosya gönderilirken sorun oluştu. Lütfen tekrar dene.",
      });
    }
  };

  const handleQuestionAnswer = async (questionId: string, answer: string) => {
    if (!sessionId) return;
    appendMessage({ role: "user", text: `${answer}` });
    const payload = {
      session_id: sessionId,
      answers: { [questionId]: answer },
    };

    setIsBusy(true);
    try {
      const response = await fetch("/api/ai-convert/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setIsBusy(false);

      if (!data.ok) {
        appendMessage({
          role: "assistant",
          text: data.message || "Sorunun cevabı işlenemedi.",
        });
        return;
      }

      setStatus(data.status ?? null);
      if (data.questions?.length) {
        setQuestions(data.questions);
        appendMessage({
          role: "assistant",
          text: "Ekstra bir soru var, bir göz atıyorum.",
        });
      } else {
        setQuestions([]);
      }

      if (data.status === "ready" && data.download_url) {
        setDownloadUrl(data.download_url);
        appendMessage({
          role: "assistant",
          text: "Excel hazır, indirebilirsin.",
        });
      }
    } catch (error) {
      setIsBusy(false);
      console.error("AI answer error:", error);
      appendMessage({
        role: "assistant",
        text: "Sunucu yanıtı alınamadı, lütfen tekrar deneyin.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-12">
        <header className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            BotExcel.AI
          </p>
          <h1 className="text-3xl font-semibold text-slate-50 md:text-4xl">
            Konuşarak belgeyi Excel’e dönüşümü başlatın
          </h1>
          <p className="max-w-2xl text-sm text-slate-300">
            Dosyanızı yükleyin, BotExcel.AI ön analizini yapıp sorularla netlik
            sağlayarak Excel’i hazırlasın.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.3fr,0.9fr]">
          <article className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-black/30">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-50">
                Dosya gönder
              </h2>
              <p className="text-sm text-slate-400">
                PDF, fotoğraf, CSV, DOCX ya da XLSX dosyanızı yükleyin. Mobilde
                fotoğraf çekip de gönderebilirsiniz.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <label className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 px-4 py-6 text-center text-sm text-slate-300 transition hover:border-emerald-400">
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
                  Şuraya sürükleyin ya da gözatın.
                </strong>
                <p className="mt-2 text-[11px] text-slate-500">
                  Maksimum 20 MB, PDF/IMG/CSV/DOCX/XLSX desteklenir.
                </p>
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy}
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
              >
                {isBusy ? "İşleniyor..." : "Yeni dosya yükle"}
              </button>
            </div>

            {preview && (
              <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-[12px] text-slate-200">
                <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Önizleme
                </div>
                <div className="flex flex-wrap gap-4 text-[11px] text-slate-400">
                  <span>Para birimi: {preview.detected.currency_guess}</span>
                  <span>
                    Tarih tahmini: {preview.detected.date_candidates.join(", ")}
                  </span>
                  <span>
                    Toplam adayı:{" "}
                    {preview.detected.total_candidates.length > 0
                      ? preview.detected.total_candidates.join(", ")
                      : "Bilinmiyor"}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-[11px]">
                    <tbody>
                      {preview.rows.map((row) => (
                        <tr key={row.Key + row.Value}>
                          <td className="pr-3 text-slate-400">{row.Key}</td>
                          <td className="font-mono text-emerald-300">
                            {row.Value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </article>

          <article className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/40">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-50">
                  AI sohbeti
                </h3>
                <span className="text-xs uppercase tracking-[0.4em] text-slate-500">
                  {status ?? "bekliyor"}
                </span>
              </div>
              <div className="space-y-3 text-sm">
                {messages.map((msg, index) => (
                  <div
                    key={`${msg.role}-${index}`}
                    className={`rounded-2xl p-3 ${
                      msg.role === "assistant"
                        ? "bg-slate-900 text-slate-100"
                        : msg.role === "user"
                        ? "bg-emerald-500/20 text-emerald-200"
                        : "bg-slate-800/60 text-slate-300"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
            </div>

            {questions.length > 0 && (
              <div className="space-y-3 pt-4">
                {questions.map((question) => (
                  <div key={question.id} className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      AI sorusu
                    </p>
                    <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                      <p className="text-sm text-slate-200">{question.prompt}</p>
                      <div className="flex flex-wrap gap-2">
                        {question.options?.map((option) => (
                          <button
                            key={option}
                            onClick={() =>
                              handleQuestionAnswer(question.id, option)
                            }
                            className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-100 transition hover:border-emerald-400 hover:text-emerald-200"
                            disabled={isBusy}
                          >
                            {option}
                          </button>
                        ))}
                        {!question.options && (
                          <button
                            onClick={() =>
                              handleQuestionAnswer(question.id, "OK")
                            }
                            className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-100 transition hover:border-emerald-400 hover:text-emerald-200"
                            disabled={isBusy}
                          >
                            Tamam
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {downloadUrl && (
              <div className="mt-4">
                <a
                  href={downloadUrl}
                  className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
                >
                  Excel’i indir
                </a>
                <p className="mt-2 text-[11px] text-slate-400">
                  Şablon kaydetmek için ekstra ayar sekmesini kullan.
                </p>
              </div>
            )}
          </article>
        </section>
      </main>
    </div>
  );
}

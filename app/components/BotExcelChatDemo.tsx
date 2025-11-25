"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  text: string;
};

type KpiState = {
  revenue: string;
  units: string;
  margin: string;
};

// Basit bir sınıf birleştirici; clsx alternatifi
function cx(
  ...values: Array<
    | string
    | false
    | null
    | undefined
    | Record<string, boolean | null | undefined>
  >
): string {
  const parts: string[] = [];

  for (const value of values) {
    if (!value) continue;

    if (typeof value === "string") {
      parts.push(value);
      continue;
    }

    for (const [key, active] of Object.entries(value)) {
      if (active) parts.push(key);
    }
  }

  return parts.join(" ");
}

export default function BotExcelChatDemo() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hoş geldin! Belgeni gönder, analiz edip tabloya çevireyim.",
    },
    {
      role: "user",
      text: "Kanka bu chat operatör ekranı nasıl çalışacak",
    },
    {
      role: "assistant",
      text: "Şu an demo modundayız; gerçek BotExcel AI bağlandığında yanıtlar backend'den gelecek.",
    },
  ]);

  const [showUserPanel, setShowUserPanel] = useState(false);
  const [input, setInput] = useState("");
  const [themeMode, setThemeMode] = useState<"system" | "light" | "dark">(
    "system"
  );
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  const [isSending, setIsSending] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [toast, setToast] = useState<{ text: string; tone?: "info" | "error" } | null>(null);

  const [chartType, setChartType] = useState<
    null | "line" | "bar" | "pie" | "pivot"
  >(null);

  // KPI demo verisi (gerçekte backend'den /api/metrics ile gelecek)
  const [kpis, setKpis] = useState<KpiState>({
    revenue: "1,25M₺",
    units: "4.320",
    margin: "%18,4",
  });

  // Demo kullanıcı bilgisi (gerçekte /whoami ve plan API'sine bağlanacak)
  const mockUser = {
    name: "Anonim Kullanıcı",
    plan: "Free",
    used: 1,
    limit: 3,
  };

  // Önizleme grid'i için küçük demo satırları
  const demoRows = [
    {
      id: "FAT-001",
      date: "01.11.2025",
      customer: "ABC Ltd.",
      total: "12.450 ₺",
    },
    {
      id: "FAT-002",
      date: "02.11.2025",
      customer: "XYZ A.Ş.",
      total: "8.730 ₺",
    },
    {
      id: "FAT-003",
      date: "03.11.2025",
      customer: "KLM Gıda",
      total: "21.980 ₺",
    },
    {
      id: "FAT-004",
      date: "04.11.2025",
      customer: "Deneme İnşaat",
      total: "4.210 ₺",
    },
    {
      id: "FAT-005",
      date: "05.11.2025",
      customer: "Test Tekstil",
      total: "16.340 ₺",
    },
  ];

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const attachMenuRef = useRef<HTMLDivElement | null>(null);
  const userPanelRef = useRef<HTMLDivElement | null>(null);

  // Tema modunu sistem / light / dark'a göre çözümle
  useEffect(() => {
    if (themeMode === "system") {
      if (
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches
      ) {
        setResolvedTheme("light");
      } else {
        setResolvedTheme("dark");
      }
    } else {
      setResolvedTheme(themeMode);
    }
  }, [themeMode]);

  // KPI'ları backend'den dene (yoksa fallback değerlerle kal)
  useEffect(() => {
    let cancelled = false;

    const fetchKpis = async () => {
      try {
        const res = await fetch("/api/metrics");
        if (!res.ok) return;
        const data = await res.json();

        if (cancelled) return;

        setKpis((prev) => ({
          revenue: data.revenue || prev.revenue,
          units: data.units || prev.units,
          margin: data.margin || prev.margin,
        }));
      } catch {
        // sessiz fallback
      }
    };

    fetchKpis();

    return () => {
      cancelled = true;
    };
  }, []);

  // Ctrl+K ile input'u odağa al
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
      if (e.key === "Escape") {
        setShowAttachMenu(false);
        setShowUserPanel(false);
        setIsDragging(false);
        setToast(null);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const applySuggestion = (text: string) => {
    setInput(text);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Menü/panel dışına tıklayınca kapat
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (showAttachMenu && attachMenuRef.current && !attachMenuRef.current.contains(target)) {
        setShowAttachMenu(false);
      }
      if (showUserPanel && userPanelRef.current && !userPanelRef.current.contains(target)) {
        setShowUserPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAttachMenu, showUserPanel]);

  // Mesaj gönderme fonksiyonu (input'u mesaja çevirir + /api/chat'e gönderir)
  const sendMessage = async () => {
    if (!input.trim() || isSending) return;

    const userText = input.trim();

    const nextMessages: ChatMessage[] = [
      ...messages,
      {
        role: "user",
        text: userText,
      },
    ];

    setInput("");
    setMessages(nextMessages);
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
        }),
      });

      let assistantText =
        "BotExcel cevabı (demo). Gerçekte burada /api/chat yanıtı gösterilecek.";

      if (res.ok) {
        const data = await res.json();
        assistantText =
          data.reply || data.answer || data.message || assistantText;
      } else {
        assistantText =
          "Şu an BotExcel API'ye ulaşılamıyor, bu sadece demo yanıtı.";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: assistantText,
        },
      ]);
    } catch (_error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "Mesajı işlerken bir hata oluştu (demo ortamı). Gerçekte BotExcel API hata detayını burada gösterecek.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // .xlsx indirme (demo): /api/download/latest üzerinden indir
  const handleDownloadXlsx = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      const res = await fetch("/api/download/latest");

      if (!res.ok) {
        setToast({ text: "İndirme başarısız (demo).", tone: "error" });
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "botexcel-sonuc.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (_error) {
      setToast({ text: "İndirme sırasında hata oluştu.", tone: "error" });
    } finally {
      setIsDownloading(false);
    }
  };

  // Tekrar çalıştır: son user mesajını input'a geri yaz
  const handleRerunLast = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setInput(lastUser.text);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Kodu gör: şimdilik bilgi mesajı ekle
  const handleShowCode = () => {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text:
          "Kodu Gör (demo): Gerçekte burada Python/VBA kodu için modal açılacak.",
      },
    ]);
  };

  // Seçilen grafik tipine göre bilgi mesajı bas
  const announceChartType = (type: "line" | "bar" | "pie" | "pivot") => {
    setChartType(type);
    const text =
      type === "line"
        ? "Çizgi grafiği seçildi (demo). Gerçekte tarih bazlı trend çizgileri hazırlanacak."
        : type === "bar"
        ? "Sütun grafiği seçildi (demo). Gerçekte kategori bazlı toplamlar hazırlanacak."
        : type === "pie"
        ? "Pasta grafiği seçildi (demo). Gerçekte ciro payları hazırlanacak."
        : "Pivot kartı seçildi (demo). Gerçekte ay x kategori kırılımı özetlenecek.";
    setMessages((prev) => [...prev, { role: "assistant", text }]);
    setToast({ text: "Grafik tipi güncellendi.", tone: "info" });
  };

  // Paylaş linki: mevcut URL'i kopyala (mümkünse)
  const handleShareLink = async () => {
    try {
      const shareUrl =
        typeof window !== "undefined" ? window.location.href : "";
      if (!shareUrl) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "Paylaş linki panoya kopyalandı." },
        ]);
        setToast({ text: "Link kopyalandı.", tone: "info" });
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `Clipboard API desteklenmiyor. Link: ${shareUrl}`,
          },
        ]);
      }
    } catch (_error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Paylaş linki kopyalanamadı. Lütfen manuel kopyala.",
        },
      ]);
      setToast({ text: "Link kopyalanamadı.", tone: "error" });
    }
  };

  // Mesajlar güncellendiğinde otomatik scroll
  useEffect(() => {
    if (!scrollRef.current) return;
    if (!isAtBottom) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isAtBottom]);

  // Kullanıcı scroll ederken "altta mıyız" durumunu güncelle
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 48;
    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    setIsAtBottom(atBottom);
  };

  // Drag & drop dosya upload (demo)
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const related = event.relatedTarget as Node | null;
    if (event.currentTarget.contains(related)) return;
    setIsDragging(false);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files || []);
    if (!files.length) return;

    const file = files[0];
    const allowedExt = [".pdf", ".xlsx", ".xls", ".png", ".jpg", ".jpeg", ".webp"];
    const lowerName = file.name.toLowerCase();
    const isAllowed =
      allowedExt.some((ext) => lowerName.endsWith(ext)) ||
      (file.type &&
        (file.type.includes("pdf") ||
          file.type.includes("spreadsheet") ||
          file.type.includes("excel") ||
          file.type.startsWith("image/")));

    if (!isAllowed) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Bu dosya formatı desteklenmiyor (demo). PDF, Excel veya görsel deneyebilirsin.",
        },
      ]);
      setToast({ text: "Desteklenmeyen dosya tipi.", tone: "error" });
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: `Dosya yüklendi: ${file.name}`,
      },
      {
        role: "assistant",
        text:
          "Bu demo modunda dosyayı henüz backend'e göndermiyorum. Gerçekte BotExcel, dosyayı /api/convert ile işleyecek.",
      },
    ]);
  };

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={cx(
        "flex h-screen w-full",
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      )}
    >
      {/* SOL SİDEBAR */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 64 : 260 }}
        transition={{ type: "spring", damping: 22, stiffness: 210 }}
        className={cx(
          "h-full border-r flex flex-col",
          isDark
            ? "border-slate-800 bg-slate-900/70"
            : "border-slate-200 bg-slate-100"
        )}
      >
        {/* Logo + collapse butonu */}
        <div
          className={cx(
            "flex items-center justify-between h-20 border-b px-3",
            isDark
              ? "border-slate-800/90"
              : "border-slate-200/90 bg-slate-50/80"
          )}
        >
          <motion.div
            layout
            animate={{ scale: sidebarCollapsed ? 0.9 : 1.15 }}
            className={cx(
              "flex h-11 w-11 items-center justify-center rounded-2xl border shadow-lg",
              isDark
                ? "bg-emerald-500/10 border-emerald-400/60 shadow-emerald-500/20"
                : "bg-emerald-500/5 border-emerald-400/70 shadow-emerald-400/25"
            )}
          >
            <img
              src="/your-logo.svg"
              alt="Logo"
              className="h-8 w-8 object-contain"
            />
          </motion.div>
          <button
            type="button"
            onClick={() => setSidebarCollapsed((v) => !v)}
            className={cx(
              "h-8 w-8 flex items-center justify-center rounded-full border text-xs",
              isDark
                ? "border-slate-700 bg-slate-900/80 text-slate-400 hover:bg-slate-800"
                : "border-slate-300 bg-slate-100 text-slate-500 hover:bg-slate-200"
            )}
          >
            {sidebarCollapsed ? "›" : "‹"}
          </button>
        </div>

        {!sidebarCollapsed && (
          <div className="p-4 space-y-4 overflow-y-auto">
            <button
              className={cx(
                "w-full py-2 rounded-lg transition text-sm font-medium flex items-center gap-2 justify-center",
                isDark
                  ? "bg-slate-800/60 hover:bg-slate-800"
                  : "bg-slate-100 hover:bg-slate-200 border border-slate-200"
              )}
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 7h9M6 11h6M6 15h4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 4h11a2 2 0 012 2v9.5a.5.5 0 01-.8.4L14 13H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Yeni sohbet</span>
            </button>

            <div
              className={cx(
                "mt-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs",
                isDark
                  ? "bg-slate-900/70 border-slate-700/80"
                  : "bg-slate-50 border-slate-200"
              )}
            >
              <svg
                className={cx(
                  "h-3.5 w-3.5",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="m15 15 3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Sohbetleri ara"
                className={cx(
                  "bg-transparent outline-none flex-1 text-[11px]",
                  isDark
                    ? "placeholder:text-slate-500 text-slate-100"
                    : "placeholder:text-slate-400 text-slate-900"
                )}
              />
            </div>

            <div className="space-y-2 text-sm">
              <div
                className={cx(
                  "p-3 rounded-lg cursor-pointer flex items-center justify-between",
                  isDark
                    ? "bg-slate-900/60 hover:bg-slate-900/80"
                    : "bg-slate-50 hover:bg-slate-100 border border-slate-200/70"
                )}
              >
                <span className="truncate">Son sohbetim</span>
                <span
                  className={cx(
                    "text-[10px]",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}
                >
                  az önce
                </span>
              </div>
              <div
                className={cx(
                  "p-3 rounded-lg cursor-pointer flex items-center justify-between",
                  isDark
                    ? "bg-slate-900/60 hover:bg-slate-900/80"
                    : "bg-slate-50 hover:bg-slate-100 border border-slate-200/70"
                )}
              >
                <span className="truncate">Fatura analizi</span>
                <span
                  className={cx(
                    "text-[10px]",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}
                >
                  dün
                </span>
              </div>
              <div
                className={cx(
                  "p-3 rounded-lg cursor-pointer flex items-center justify-between",
                  isDark
                    ? "bg-slate-900/60 hover:bg-slate-900/80"
                    : "bg-slate-50 hover:bg-slate-100 border border-slate-200/70"
                )}
              >
                <span className="truncate">Excel otomasyon</span>
                <span
                  className={cx(
                    "text-[10px]",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}
                >
                  2 gün önce
                </span>
              </div>
            </div>
          </div>
        )}
      </motion.aside>

      {/* SAĞ ANA BÖLGE */}
      <div className="flex flex-col flex-1">
        {/* ÜST BAR */}
        <div
          className={cx(
            "h-16 flex items-center justify-between px-6 border-b backdrop-blur-md relative",
            isDark
              ? "border-slate-800 bg-slate-950/80"
              : "border-slate-200 bg-slate-50/90"
          )}
        >
          <div className="flex flex-col gap-1">
            <div className="text-base font-medium">BotExcel</div>
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              <span
                className={cx(
                  "px-2 py-0.5 rounded-full border",
                  isDark
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                    : "border-emerald-400/70 bg-emerald-50 text-emerald-800"
                )}
              >
                Ciro: {kpis.revenue}
              </span>
              <span
                className={cx(
                  "px-2 py-0.5 rounded-full border",
                  isDark
                    ? "border-slate-700 bg-slate-900/80 text-slate-200"
                    : "border-slate-300 bg-slate-50 text-slate-800"
                )}
              >
                Adet: {kpis.units}
              </span>
              <span
                className={cx(
                  "px-2 py-0.5 rounded-full border",
                  isDark
                    ? "border-sky-500/40 bg-sky-500/10 text-sky-200"
                    : "border-sky-400/70 bg-sky-50 text-sky-800"
                )}
              >
                Marj: {kpis.margin}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div
              className={cx(
                "flex items-center gap-1 rounded-full border px-1.5 py-0.5",
                isDark
                  ? "bg-slate-900/80 border-slate-700"
                  : "bg-slate-100 border-slate-300"
              )}
            >
              <button
                type="button"
                onClick={() => setThemeMode("system")}
                className={cx(
                  "px-1.5 py-0.5 rounded-full text-[10px] leading-none",
                  themeMode === "system"
                    ? isDark
                      ? "bg-slate-700 text-slate-50"
                      : "bg-slate-300 text-slate-900"
                    : isDark
                    ? "text-slate-400 hover:text-slate-100"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setThemeMode("light")}
                className={cx(
                  "px-1.5 py-0.5 rounded-full text-[10px] leading-none",
                  themeMode === "light"
                    ? isDark
                      ? "bg-slate-700 text-slate-50"
                      : "bg-slate-300 text-slate-900"
                    : isDark
                    ? "text-slate-400 hover:text-slate-100"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                ☀
              </button>
              <button
                type="button"
                onClick={() => setThemeMode("dark")}
                className={cx(
                  "px-1.5 py-0.5 rounded-full text-[10px] leading-none",
                  themeMode === "dark"
                    ? isDark
                      ? "bg-slate-700 text-slate-50"
                      : "bg-slate-300 text-slate-900"
                    : isDark
                    ? "text-slate-400 hover:text-slate-100"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                ☾
              </button>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <button
              type="button"
              onClick={() => setShowUserPanel((v) => !v)}
              className={cx(
                "rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:ring-offset-2",
                isDark
                  ? "focus:ring-offset-slate-950"
                  : "focus:ring-offset-slate-50"
              )}
            >
              <img
                src="/default-avatar.png"
                alt="User"
                className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-600"
              />
            </button>
          </div>

          {showUserPanel && (
            <motion.div
              ref={userPanelRef}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cx(
                "absolute right-4 top-16 z-20 w-64 rounded-xl border shadow-xl p-4 text-xs space-y-2",
                isDark
                  ? "border-slate-800 bg-slate-900/95"
                  : "border-slate-200 bg-white"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    Kullanıcı
                  </div>
                  <div
                    className={cx(
                      "text-sm font-medium",
                      isDark ? "text-slate-100" : "text-slate-900"
                    )}
                  >
                    {mockUser.name}
                  </div>
                </div>
                <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-medium">
                  {mockUser.plan}
                </span>
              </div>

              <div className="pt-1 text-[11px] text-slate-400">
                Kalan hak:
                <span className="ml-1 text-slate-100">
                  {mockUser.limit - mockUser.used}
                </span>
                <span className="mx-1 text-slate-500">/</span>
                <span className="text-slate-300">{mockUser.limit}</span>
              </div>

              <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-800 mt-2">
                Bu alan demo verisiyle çalışıyor. Gerçekte /whoami ve plan API&apos;sine bağlanacak.
              </div>
            </motion.div>
          )}
        </div>

        {/* MESAJ LİSTESİ + DRAG AREA */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cx(
            "flex-1 overflow-y-auto px-6 py-5 space-y-4 transition",
            isDark
              ? "bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950"
              : "bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100",
            isDragging &&
              (isDark
                ? "ring-2 ring-emerald-400/60 ring-offset-2 ring-offset-slate-950"
                : "ring-2 ring-emerald-400/60 ring-offset-2 ring-offset-slate-50")
          )}
        >
          {isDragging && (
            <div
              className={cx(
                "mb-2 rounded-lg border px-3 py-2 text-[11px] flex items-center gap-2",
                isDark
                  ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-200"
                  : "border-emerald-400/60 bg-emerald-50 text-emerald-800"
              )}
            >
              <span>Dosyanı buraya bırak, BotExcel tabloya çevirmeye hazırlansın.</span>
            </div>
          )}

          {messages.map((m, i) => {
            const isUserMsg = m.role === "user";
            return (
              <div
                key={i}
                className={cx("flex w-full", {
                  "justify-end": isUserMsg,
                  "justify-start": !isUserMsg,
                })}
              >
                <div className="flex flex-col gap-2 max-w-[78%]">
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 6,
                      x: isUserMsg ? 10 : -10,
                    }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ duration: 0.18 }}
                    className={cx(
                      "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                      isUserMsg
                        ? isDark
                          ? "bg-emerald-500/15 border border-emerald-400/60 text-emerald-50"
                          : "bg-emerald-50 border border-emerald-300 text-emerald-900"
                        : isDark
                        ? "bg-slate-900/70 border border-slate-800 text-slate-100"
                        : "bg-white border border-slate-200 text-slate-900"
                    )}
                  >
                    {m.text}
                  </motion.div>

                  {!isUserMsg && (
                    <>
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        <button
                          type="button"
                          onClick={handleDownloadXlsx}
                          disabled={isDownloading}
                          className={cx(
                            "px-2.5 py-1 rounded-full border",
                            isDark
                              ? "border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800 disabled:opacity-60"
                              : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 disabled:opacity-60"
                          )}
                        >
                          {isDownloading ? "İndiriliyor..." : "İndir .xlsx"}
                        </button>
                        <button
                          type="button"
                          onClick={handleShowCode}
                          className={cx(
                            "px-2.5 py-1 rounded-full border",
                            isDark
                              ? "border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                              : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
                          )}
                        >
                          Kodu Gör (.py/.bas)
                        </button>
                        <button
                          type="button"
                          onClick={handleRerunLast}
                          className={cx(
                            "px-2.5 py-1 rounded-full border",
                            isDark
                              ? "border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                              : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
                          )}
                        >
                          Tekrar Çalıştır
                        </button>
                        <button
                          type="button"
                          onClick={handleShareLink}
                          className={cx(
                            "px-2.5 py-1 rounded-full border",
                            isDark
                              ? "border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                              : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
                          )}
                        >
                          Paylaş Linki
                        </button>
                      </div>

                      <div
                        className={cx(
                          "w-full rounded-xl border p-3 text-xs mt-1",
                          isDark
                            ? "border-slate-800 bg-slate-950/60"
                            : "border-slate-200 bg-white/80"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">Sonuç kartı (demo)</div>
                            <span
                              className={cx(
                                "text-[10px] px-1.5 py-0.5 rounded-full border",
                                isDark
                                  ? "border-slate-700 bg-slate-900/80 text-slate-300"
                                  : "border-slate-300 bg-slate-50 text-slate-700"
                              )}
                            >
                              Önizleme grid&apos;i
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-[10px]">
                              <button
                                type="button"
                                className={cx(
                                  "px-2 py-0.5 rounded-full border",
                                  isDark
                                    ? "border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
                                    : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
                                )}
                              >
                                Filtre
                              </button>
                              <button
                                type="button"
                                className={cx(
                                  "px-2 py-0.5 rounded-full border",
                                  isDark
                                    ? "border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
                                    : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
                                )}
                              >
                                Sırala
                              </button>
                              <button
                                type="button"
                                className={cx(
                                  "px-2 py-0.5 rounded-full border",
                                  isDark
                                    ? "border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
                                    : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
                                )}
                              >
                                Dışa aktar
                              </button>
                            </div>
                            <button
                              type="button"
                              className={cx(
                                "px-2 py-1 rounded-md text-[11px] font-medium",
                                isDark
                                  ? "bg-slate-800 text-slate-100 hover:bg-slate-700"
                                  : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                              )}
                            >
                              Kopyala CSV
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-1.5 mb-1 text-[10px]">
                          <span
                            className={cx(
                              "mr-auto text-[10px]",
                              isDark ? "text-slate-400" : "text-slate-600"
                            )}
                          >
                            Grafik kısayolları:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              announceChartType("line");
                              applySuggestion(
                                "Çizgi grafiği: Bu tablodan tarih bazlı trend gösteren bir çizgi grafiği oluştur."
                              );
                            }}
                            className={cx(
                              "px-2 py-0.5 rounded-full border",
                              isDark
                                ? "border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
                                : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
                            )}
                          >
                            Çizgi
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              announceChartType("bar");
                              applySuggestion(
                                "Sütun grafiği: Kategori bazlı toplamları gösteren bir sütun grafiği oluştur."
                              );
                            }}
                            className={cx(
                              "px-2 py-0.5 rounded-full border",
                              isDark
                                ? "border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
                                : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
                            )}
                          >
                            Sütun
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              announceChartType("pie");
                              applySuggestion(
                                "Pasta grafiği: Toplam ciroyu müşteri veya kategori paylarına göre pasta grafikte göster."
                              );
                            }}
                            className={cx(
                              "px-2 py-0.5 rounded-full border",
                              isDark
                                ? "border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
                                : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
                            )}
                          >
                            Pasta
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              announceChartType("pivot");
                              applySuggestion(
                                "Pivot kartı: Bu tabloyu ay ve kategori kırılımında özetleyen bir pivot kartı oluştur."
                              );
                            }}
                            className={cx(
                              "px-2 py-0.5 rounded-full border",
                              isDark
                                ? "border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
                                : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
                            )}
                          >
                            Pivot
                          </button>
                        </div>

                        <div
                          className={cx(
                            "rounded-lg border px-3 py-2 text-[11px] max-h-40 overflow-auto",
                            isDark
                              ? "border-slate-700 bg-slate-950/60 text-slate-200"
                              : "border-slate-300 bg-white text-slate-800"
                          )}
                        >
                          <div
                            className={cx(
                              "grid grid-cols-4 text-[10px] font-medium border-b pb-1 mb-1",
                              isDark
                                ? "border-slate-700 text-slate-300"
                                : "border-slate-200 text-slate-700"
                            )}
                          >
                            <div>Fatura No</div>
                            <div>Tarih</div>
                            <div>Müşteri</div>
                            <div className="text-right">Toplam</div>
                          </div>
                          <div className="space-y-0.5">
                            {demoRows.map((row) => (
                              <div
                                key={row.id}
                                className={cx(
                                  "grid grid-cols-4 py-0.5 text-[10px]",
                                  isDark
                                    ? "hover:bg-slate-900/80"
                                    : "hover:bg-slate-100"
                                )}
                              >
                                <div className="truncate">{row.id}</div>
                                <div>{row.date}</div>
                                <div className="truncate">{row.customer}</div>
                                <div className="text-right font-medium">
                                  {row.total}
                                </div>
                              </div>
                            ))}
                            <div className="mt-1 text-[10px] italic text-slate-500">
                              Büyük tablolar burada satır satır sanallaştırılmış şekilde kayacak.
                            </div>
                          </div>
                        </div>

                        {chartType && (
                          <div
                            className={cx(
                              "mt-2 rounded-lg border px-3 py-2 text-[11px]",
                              isDark
                                ? "border-sky-500/40 bg-sky-950/40 text-sky-100"
                                : "border-sky-400/70 bg-sky-50 text-sky-900"
                            )}
                          >
                            {chartType === "line" && (
                              <div>
                                Çizgi grafiği önizlemesi (demo). Gerçekte burada tarih bazlı trend
                                çizgileri gösterilecek.
                              </div>
                            )}
                            {chartType === "bar" && (
                              <div>
                                Sütun grafiği önizlemesi (demo). Gerçekte kategori bazlı toplamlar
                                gösterilecek.
                              </div>
                            )}
                            {chartType === "pie" && (
                              <div>
                                Pasta grafiği önizlemesi (demo). Gerçekte ciro payları gösterilecek.
                              </div>
                            )}
                            {chartType === "pivot" && (
                              <div>
                                Pivot kartı önizlemesi (demo). Gerçekte ay x kategori kırılımı
                                özetlenecek.
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] mt-1">
                        <span
                          className={cx(
                            "font-medium",
                            isDark ? "text-slate-300" : "text-slate-700"
                          )}
                        >
                          Sonraki adım:
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            applySuggestion(
                              "Grafik ekle: Bu tablodan kategorilere göre toplam tutarı gösteren bir sütun grafiği oluştur."
                            )
                          }
                          className={cx(
                            "px-2 py-1 rounded-full border",
                            isDark
                              ? "border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                              : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
                          )}
                        >
                          Grafik ekleyeyim mi?
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                applySuggestion(
                  "VBA butonu: Bu sayfaya raporu güncelleyen bir &apos;Yenile&apos; butonu ekleyen VBA macro yaz."
                )
                          }
                          className={cx(
                            "px-2 py-1 rounded-full border",
                            isDark
                              ? "border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                              : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
                          )}
                        >
                          VBA butonu ister misin?
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            applySuggestion(
                              "Fiyat hatalarını bul: Bu tablodaki satırlarda olağan dışı (ortalamanın çok üstü/altı) fiyatları işaretle."
                            )
                          }
                          className={cx(
                            "px-2 py-1 rounded-full border",
                            isDark
                              ? "border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                              : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
                          )}
                        >
                          Fiyat hatalarını bulayım mı?
                        </button>
                      </div>

                      <div
                        className={cx(
                          "mt-1 w-full rounded-lg border px-3 py-2 text-[11px]",
                          isDark
                            ? "border-amber-500/40 bg-amber-950/40 text-amber-100"
                            : "border-amber-400/70 bg-amber-50 text-amber-900"
                        )}
                      >
                        <div className="font-medium mb-1">
                          Hata açıklamaları (örnek)
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            Formül hatası:
                            <code className="ml-1 font-mono text-[10px]">
                              =TOPLA(A2:A10
                            </code>
                            <span className="ml-1">→ Hücre:</span>
                            <span className="ml-1 font-mono text-[10px]">C5</span>
                          </div>
                          <button
                            type="button"
                            className={cx(
                              "px-2 py-1 rounded-md text-[10px] font-medium",
                              isDark
                                ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                                : "bg-amber-500 text-white hover:bg-amber-400"
                            )}
                          >
                            Düzelt ve uygula
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={cx(
            "p-4 border-t backdrop-blur-md relative",
            isDark
              ? "border-slate-800 bg-slate-950/90"
              : "border-slate-200 bg-slate-50/90"
          )}
        >
          <div
            className={cx(
              "mb-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px]",
              isDark
                ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-200"
                : "border-emerald-400/60 bg-emerald-50 text-emerald-800"
            )}
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3 5 6v6c0 4.418 3.134 6.955 7 8 3.866-1.045 7-3.582 7-8V6l-7-3z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 9v4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="16" r="0.6" fill="currentColor" />
            </svg>
            <span>Yüklediğin dosyalar oturum bitince silinir.</span>
          </div>

          <div className="mb-2 flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() =>
                applySuggestion(
                  "Tablo Yap: Bu veriyi temizle, sütunları isimlendir ve Excel'de kullanıma hazır tabloya çevir."
                )
              }
              className={cx(
                "px-3 py-1 rounded-full border transition",
                isDark
                  ? "border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                  : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
              )}
            >
              Tablo Yap
            </button>
            <button
              type="button"
              onClick={() =>
                applySuggestion(
                  "Pivot Oluştur: Bu tablodan özet pivot tablo çıkar; satırda kategori, sütunda ay, değerde toplam tutar olsun."
                )
              }
              className={cx(
                "px-3 py-1 rounded-full border transition",
                isDark
                  ? "border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                  : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
              )}
            >
              Pivot Oluştur
            </button>
            <button
              type="button"
              onClick={() =>
                applySuggestion(
                  "Faturadan Alan Çıkar: Bu PDF faturalardan tarih, cari adı, fatura no, KDV, genel toplam alanlarını yakala."
                )
              }
              className={cx(
                "px-3 py-1 rounded-full border transition",
                isDark
                  ? "border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                  : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
              )}
            >
              Faturadan Alan Çıkar
            </button>
            <button
              type="button"
              onClick={() =>
                applySuggestion(
                  "VBA Butonu Ekle: Bu sayfaya &apos;Yenile&apos; butonu ekleyen bir VBA macro yaz ve butonu sayfaya yerleştir."
                )
              }
              className={cx(
                "px-3 py-1 rounded-full border transition",
                isDark
                  ? "border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                  : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
              )}
            >
              VBA Butonu Ekle
            </button>
            <button
              type="button"
              onClick={() =>
                applySuggestion(
                  "PDF&apos;e Çevir: Bu rapor sayfasını Excel içinden tek sayfalık, yazdırmaya hazır bir PDF&apos;e çevir."
                )
              }
              className={cx(
                "px-3 py-1 rounded-full border transition",
                isDark
                  ? "border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                  : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
              )}
            >
              PDF&apos;e Çevir
            </button>
          </div>

          <div className="flex gap-3 items-center">
            <div
              className={cx(
                "flex-1 flex items-center gap-2 rounded-xl border px-3",
                isDark
                  ? "bg-slate-900/60 border-slate-700"
                  : "bg-white border-slate-300"
              )}
            >
                <div className="relative mr-2" ref={attachMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowAttachMenu((v) => !v)}
                  className={cx(
                    "inline-flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold border transition",
                    isDark
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                      : "bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200"
                  )}
                >
                  +
                </button>
                {showAttachMenu && (
                  <div
                    className={cx(
                      "absolute left-0 bottom-9 z-20 w-48 rounded-lg border shadow-lg py-1 text-xs",
                      isDark
                        ? "border-slate-700 bg-slate-900/95"
                        : "border-slate-200 bg-white"
                    )}
                  >
                    <button
                      type="button"
                      className={cx(
                        "w-full flex items-center gap-2 px-3 py-2 text-xs",
                        isDark
                          ? "hover:bg-slate-800/80 text-slate-100"
                          : "hover:bg-slate-100 text-slate-900"
                      )}
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 3v14m0-14L8 7m4-4 4 4"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5 13v5a1 1 0 001 1h12a1 1 0 001-1v-5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Fotoğraf veya Dosya ekle</span>
                    </button>
                  </div>
                )}
              </div>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder="PDF/Excel sürükle → 3 saniyede tabloya çevir • /komut • Ctrl+K"
                className={cx(
                  "flex-1 bg-transparent py-3 text-sm outline-none",
                  isDark
                    ? "placeholder:text-slate-500 text-slate-100"
                    : "placeholder:text-slate-400 text-slate-900"
                )}
              />
            </div>
            <button
              onClick={() => void sendMessage()}
              disabled={isSending}
              className={cx(
                "px-4 py-3 rounded-xl text-sm font-medium active:scale-95 transition",
                isDark
                  ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300 disabled:opacity-60"
                  : "bg-emerald-500 text-white hover:bg-emerald-400 disabled:opacity-60"
              )}
            >
              {isSending ? "Gönderiliyor..." : "Gönder"}
            </button>
          </div>
        </div>

        {toast && (
          <div
            className={cx(
              "pointer-events-none absolute bottom-4 right-4 rounded-lg px-4 py-2 text-sm shadow-lg",
              toast.tone === "error"
                ? isDark
                  ? "bg-rose-500/20 text-rose-100 border border-rose-400/50"
                  : "bg-rose-100 text-rose-800 border border-rose-200"
                : isDark
                ? "bg-emerald-500/15 text-emerald-100 border border-emerald-400/40"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
            )}
          >
            {toast.text}
          </div>
        )}
      </div>
    </div>
  );
}

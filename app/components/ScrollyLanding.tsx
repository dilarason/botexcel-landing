"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Aşama etiketleri için üçgen opaklık eğrisi
const stageBand = (p: number, start: number, peak: number, end: number) => {
  if (p <= start || p >= end) return 0;
  if (p === peak) return 1;
  if (p < peak) return clamp((p - start) / (peak - start), 0, 1);
  return clamp(1 - (p - peak) / (end - peak), 0, 1);
};

// İçerik verileri
const userStories = [
  {
    title: "Finans & Denetim ekipleri",
    description:
      "Ay sonunda yüzlerce fatura ve banka ekstresiyle uğraşan finans yöneticileri, BotExcel sayesinde birkaç dakikada birleşik ve doğrulanmış tabloya ulaşıyor.",
    bullets: [
      "PDF → Excel dönüşümü 3 dakika altında",
      "Yanlış toplam riskine karşı akıllı uyarılar",
      "Audit trail ile izlenebilir hücreler",
    ],
  },
  {
    title: "Operasyon & Lojistik",
    description:
      "Sevk irsaliyelerini ve kargo fişlerini kamerayla okut, stok tablosu otomatik güncellensin; eksik ürünler için eylem listesi hazır olsun.",
    bullets: [
      "Barkod ve optik karakter tanıma ile tek seferde kayıt",
      "Gerçek zamanlı stok ve tedarik görünürlüğü",
      "Operasyonel raporlar dakikalar içinde",
    ],
  },
  {
    title: "KOBİ'ler",
    description:
      "Manavdan kırtasiyeye tüm küçük işletmeler, fiş ve makbuzlarını BotExcel’e yükleyerek günlük satış ve giderlerini zahmetsizce takip ediyor.",
    bullets: [
      "Buluta bağımlı olmayan masaüstü zekâ",
      "Logo, Mikro, Paraşüt entegrasyonları",
      "Basit Excel şablonlarıyla satış & stok takibi",
    ],
  },
  {
    title: "Kurumsal / Enterprise",
    description:
      "Bankacılık ve denetim ekipleri, yerel yapay zekâ ve ayrıntılı erişim kontrolleri sayesinde KVKK uyumlu veri temizleme süreçlerini otomatikleştiriyor.",
    bullets: [
      "On-prem yapay zekâ seçeneği",
      "ERP / CRM / BI entegrasyon kitleri",
      "Detaylı loglama ve raporlama",
    ],
  },
];

const capabilities = [
  {
    title: "Evrensel Dönüştürücü Motoru",
    text:
      "PDF, TXT, e-posta ve fotoğraflardaki verileri temiz, biçimlendirilmiş Excel tablolara dönüştürür; sayı formatlarını ve para birimlerini otomatik düzeltir.",
  },
  {
    title: "Doğruluk & Audit Trail",
    text:
      "Her hücre kaynağı, satır numarası, model sürümü ve işlem tarihiyle kaydedilir; denetime hazır, hesap verilebilir yapay zekâ standardı sunar.",
  },
  {
    title: "Barkod + Optik Tarama Analitiği",
    text:
      "Barkod, QR ve optik karakter tanıma (OCR) ile kağıt üzerindeki metinleri yakalar; stok ve kargo tablolarını otomatik hazırlar.",
  },
  {
    title: "API & CLI Otomasyonu",
    text:
      "Tek AI motoru REST API veya komut satırı üzerinden çalışır; ERP, CRM ve BI entegrasyonlarını birkaç komutla hayata geçirin.",
  },
];

const templates = [
  {
    title: "Finans Dashboard",
    text:
      "Pivot tablolar, dönemsel KDV özetleri ve nakit akışı grafikleriyle sunuma hazır finans raporu. Her ay otomatik güncellenir.",
  },
  {
    title: "Stok & Sevkiyat İzleme",
    text:
      "Barkodlu stok giriş-çıkış, kritik eşik uyarıları ve otomatik tedarik önerileri; tedarik planınız sabah hazır olur.",
  },
  {
    title: "Audit & KVKK Kayıtları",
    text:
      "Hücre bazlı değişiklik logu, kullanıcı aksiyonları ve denetim notlarını tek dosyada toplayın; denetim oturumlarında hazır olun.",
  },
  {
    title: "Satış / POS Konsolidasyonu",
    text:
      "WhatsApp, e-ticaret ve POS verilerini normalize edip gelir tablosuna dönüştürür; büyüme kanallarınızı net görmenizi sağlar.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "Ücretsiz",
    tagline: "Başlamak için ideal.",
    bullets: [
      "Ayda 5 dosya",
      "Temel PDF → Excel dönüşümü",
      "Standart şablonlara erişim",
      "E-posta ile topluluk destek",
    ],
    cta: "Ücretsiz Dene",
    highlight: false,
  },
  {
    name: "Pro",
    price: "Pro",
    tagline: "Finans ve operasyon ekipleri için.",
    bullets: [
      "Ayda 500+ dosya",
      "Sınırsız OCR ve tablo tanıma",
      "Özel Excel şablonları",
      "Audit trail ve hücre bazlı log",
      "Öncelikli destek",
    ],
    cta: "Pro'ya Geç",
    highlight: true,
  },
  {
    name: "Business",
    price: "Business",
    tagline: "Ekipler ve entegrasyonlar için.",
    bullets: [
      "Ayda 5.000+ dosya",
      "REST API & CLI erişimi",
      "Log arşivleme ve dışa aktarma",
      "Ekip hesapları ve SSO",
      "Öncelikli canlı destek",
    ],
    cta: "Satışla Konuş",
    highlight: false,
  },
];

const resources = [
  {
    label: "Rehber",
    title: "Excel’de barkodlu stok takibi nasıl yapılır?",
    text: "Şablon, barkod okuyucu kurulumu ve BotExcel entegrasyonunu anlatan adım adım rehber.",
    cta: "Oku",
  },
  {
    label: "API",
    title: "BotExcel REST & CLI Dökümantasyonu",
    text: "Kimlik doğrulama, örnek istekler, dönüş formatları ve hata kodlarıyla tam API referansı.",
    cta: "Oku",
  },
  {
    label: "KVKK",
    title: "Veri Güvenliği & Audit Katmanı",
    text: "Yerel yapay zekâ mimarisi, erişim kontrolleri, log yönetimi ve KVKK uyumluluğu için teknik döküman.",
    cta: "Oku",
  },
];

const blogPosts = [
  {
    title: "Yapay zekâ ile Excel otomasyonu: Finans ekipleri için yeni dönem",
    excerpt:
      "Klasik makrolardan üretici yapay zekâ modellerine geçişte finans ekiplerinin dikkat etmesi gereken noktalar.",
  },
  {
    title: "PDF’ten tabloya dönüşümde dikkat edilmesi gereken 7 nokta",
    excerpt:
      "Eksik alanlar, bozuk tarih formatları ve para birimleriyle baş etmenin pratik yollarını derledik.",
  },
  {
    title: "KOBİ’ler için veri yönetimi rehberi",
    excerpt:
      "Manavdan lojistik firmasına kadar, günlük veri disiplinini kurmak için uygulanabilir öneriler.",
  },
];

// Özellikler bölümü verisi
const features = [
  {
    title: "Akıllı Dönüştürme Motoru",
    desc:
      "PDF, DOCX, CSV veya görsel fark etmez - BotExcel tüm formatları tanır ve dakikalar içinde okunabilir Excel tablolara dönüştürür.",
  },
  {
    title: "Yapay Zekâ ile Alan Tanıma",
    desc:
      "LLM destekli analiz; belge içindeki tarih, tutar, hesap, firma gibi alanları otomatik algılar ve doğru sütunlara yerleştirir.",
  },
  {
    title: "Gerçek Excel, Gerçek Formüller",
    desc:
      "Sadece veri değil, yapısıyla anlamlı bir Excel üretir: formüller, koşullu biçimler ve özet tablolar otomatik olarak eklenir.",
  },
  {
    title: "Audit Trail ve Güvenlik",
    desc:
      "Her dönüşüm kim tarafından, ne zaman yapıldı - kayıt altındadır. Veriler şifreli, KVKK ve GDPR uyumlu şekilde saklanır.",
  },
  {
    title: "Doğrulama ve Tutarlılık Kontrolü",
    desc:
      "AI, tablo içindeki toplam değerleri, tekrar eden kayıtları ve hatalı alanları tespit ederek tutarlılık konusunda uyarır.",
  },
  {
    title: "Barkod ve Görsel Tanıma",
    desc:
      "Kamera veya dosyadan barkod okutur, ürün bilgisini tanır ve doğrudan Excel'e işler - özellikle küçük işletmeler için ideal.",
  },
];

// Basit, dış dosyaya ihtiyaç duymayan logo bileşeni
const BotExcelLogo: React.FC = () => (
  <div className="flex items-center gap-2">
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/60 bg-emerald-500/10 shadow-sm">
      <span className="text-[11px] font-black tracking-tight text-emerald-300">Bx</span>
    </span>
    <span className="font-semibold tracking-tight text-slate-100 text-sm sm:text-base">
      BotExcel
    </span>
  </div>
);

const BotExcelScrollDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(0);

  // Scroll oranını sadece animasyon bölümüne göre hesapla
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, clientHeight } = container;
      const animHeight = clientHeight * 3; // 300vh'lik animasyon bölgesi
      const maxAnimScroll = animHeight - clientHeight || 1;
      const p = clamp(scrollTop / maxAnimScroll, 0, 1);
      setProgress(p);
    };
    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Canvas çizimleri
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (p: number) => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      const { width, height } = canvas;
      const t = clamp(p, 0, 1);
      ctx.clearRect(0, 0, width, height);

      // Arka plan
      const bgStrength = lerp(0.6, 1, t < 0.7 ? t / 0.7 : 1);
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(15,23,42,1)");
      gradient.addColorStop(1, `rgba(15,23,42,${bgStrength})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const spotRadius = width * 0.5;
      const spotGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        spotRadius
      );
      spotGradient.addColorStop(0, "rgba(30,64,175,0.55)");
      spotGradient.addColorStop(1, "rgba(15,23,42,0)");
      ctx.fillStyle = spotGradient;
      ctx.fillRect(0, 0, width, height);

      // Upload ikonu
      if (t > 0.22 && t < 0.55) {
        const local = clamp((t - 0.22) / 0.33, 0, 1);
        const cx = width / 2;
        const cy = height / 2;
        const radius = lerp(36, 44, Math.sin(local * Math.PI));
        const rotation = local * Math.PI * 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = "#4ade80";
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -radius + 10);
        ctx.lineTo(0, 10);
        ctx.moveTo(-10, -radius + 26);
        ctx.lineTo(0, -radius + 10);
        ctx.lineTo(10, -radius + 26);
        ctx.strokeStyle = "#bbf7d0";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      }

      // Ayrıştırma şeritleri
      if (t >= 0.5 && t < 0.72) {
        const local = clamp((t - 0.5) / 0.22, 0, 1);
        const bands = 8;
        const bandHeight = height * 0.5 * (1 / bands);
        const startY = height * 0.25;
        for (let i = 0; i < bands; i++) {
          const y = startY + i * bandHeight;
          const shift = (i % 2 === 0 ? 1 : -1) * local * width * 0.15;
          const alpha = 0.08 + local * 0.25;
          ctx.fillStyle = `rgba(56,189,248,${alpha})`;
          ctx.fillRect(width * 0.2 + shift, y, width * 0.6, bandHeight * 0.6);
        }
      }

      // Tablo: kaydırdıkça satır satır, hücre hücre yerleşen veri
      if (t >= 0.7) {
        const local = clamp((t - 0.7) / 0.3, 0, 1);
        const rows = 6;
        const cols = 8;
        const gridWidth = width * 0.7;
        const gridHeight = height * 0.5;
        const cellW = gridWidth / cols;
        const cellH = gridHeight / rows;

        const scale = lerp(0.9, 1, local);
        const offsetX = width / 2 - (gridWidth * scale) / 2;
        const offsetY = height / 2 - (gridHeight * scale) / 2;

        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);

        ctx.globalAlpha = 0.2 + local * 0.8;
        ctx.strokeStyle = "rgba(187,247,208,1)";
        ctx.lineWidth = 1;

        for (let r = 0; r <= rows; r++) {
          ctx.beginPath();
          ctx.moveTo(0, r * cellH);
          ctx.lineTo(gridWidth, r * cellH);
          ctx.stroke();
        }
        for (let c = 0; c <= cols; c++) {
          ctx.beginPath();
          ctx.moveTo(c * cellW, 0);
          ctx.lineTo(c * cellW, gridHeight);
          ctx.stroke();
        }

        const fillOrder: Array<[number, number]> = [];
        for (let r = 1; r < rows; r++) {
          for (let c = 1; c < cols - 1; c++) fillOrder.push([r, c]);
        }

        const total = fillOrder.length;
        const easedLocal = local * local;
        const visibleCount = Math.floor(easedLocal * total);

        for (let i = 0; i < visibleCount; i++) {
          const [r, c] = fillOrder[i];
          const baseIndexProgress = i / total;
          const cellProgress = clamp((easedLocal - baseIndexProgress) * 4, 0, 1);
          const x = c * cellW;
          const y = r * cellH;
          const slideY = (1 - cellProgress) * (cellH * 0.3);

          ctx.save();
          ctx.globalAlpha = 0.2 + 0.8 * cellProgress;
          ctx.fillStyle = "rgba(34,197,94,0.9)";
          ctx.fillRect(x + 4, y + 4 + slideY, cellW - 8, cellH - 8);
          ctx.restore();
        }

        ctx.restore();
      }
    };

    draw(progress);
  }, [progress]);

  const heroOpacity = (() => {
    const t = (progress - 0.05) / (0.25 - 0.05);
    return clamp(1 - t, 0, 1);
  })();

  const o2 = stageBand(progress, 0.2, 0.3, 0.4);
  const o3 = stageBand(progress, 0.4, 0.52, 0.64);
  const o4 = stageBand(progress, 0.64, 0.78, 0.92);

  return (
    <div className="w-full h-screen flex flex-col bg-black text-white font-sans">
      {/* Üst sabit bar + logo */}
      <header className="px-4 py-2 text-sm flex items-center justify-between border-b border-slate-800 bg-slate-950/80 z-30">
        <BotExcelLogo />
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Aşağı kaydır: slogan → upload → ayrıştırma → veri yerleşmesi → site içerikleri
          </span>
          <a
            href="/register"
            className="inline-flex items-center justify-center rounded-full border border-emerald-400/70 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
          >
            Hemen Başla
          </a>
        </div>
      </header>

      <div ref={containerRef} className="relative flex-1 overflow-y-scroll bg-black/95">
        <div className="relative">
          {/* Animasyon bölümü: 300vh + sticky canvas */}
          <div className="relative" style={{ height: "300vh" }}>
            <div className="sticky top-0 h-screen w-full z-20">
              <canvas ref={canvasRef} className="w-full h-full block" aria-hidden="true" />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <div
                  className="max-w-3xl"
                  style={{ opacity: heroOpacity, transition: "opacity 200ms linear" }}
                >
                  <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
                    <span className="bx-gradient-text">Veri karmaşasından tablo</span>{" "}
                    <span className="text-white">netliğine</span>
                  </h1>
                  <p className="text-sm md:text-base text-slate-200/85">
                    <span className="bx-gradient-text">
                      Fatura, sözleşme, fotoğraf, CSV… BotExcel karmaşık dosyaları otomatik okuyup dakikalar içinde
                      anlamlı Excel tablolarına çevirir.
                    </span>{" "}
                    <span className="text-white">Sen sadece karar verirsin.</span>
                  </p>
                </div>

                <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                  <div
                    className="text-lg md:text-2xl font-medium text-emerald-300 drop-shadow"
                    style={{ opacity: o2 }}
                  >
                    <span className="bx-gradient-text">Dosya</span>{" "}
                    <span className="text-white">yükleniyor…</span>
                  </div>
                  <div
                    className="text-lg md:text-2xl font-medium text-sky-300 drop-shadow"
                    style={{ opacity: o3 }}
                  >
                    <span className="bx-gradient-text">Veri</span>{" "}
                    <span className="text-white">ayrıştırılıyor…</span>
                  </div>
                  <div
                    className="text-xl md:text-3xl font-semibold text-emerald-200 drop-shadow"
                    style={{ opacity: o4 }}
                  >
                    <span className="bx-gradient-text">Excel</span>{" "}
                    <span className="text-white">hazır.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Animasyon bittikten sonra gelen site içerikleri */}
          <div className="relative bg-slate-950 text-left">
            <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-12 pb-12 text-center text-slate-50">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
                Belgeni yükle, 3 ücretsiz dönüşüm al
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl mx-auto mb-6">
                Animasyon bitti; şimdi kendi dosyanı dene. BotExcel karmaşık belgeleri dakikalar içinde Excel’e çevirir.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/upload"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 shadow hover:bg-emerald-400"
                >
                  Belgeni Yükle
                </a>
                <a
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800"
                >
                  Hemen Başla
                </a>
              </div>
            </section>

            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-10 text-center text-slate-200">
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
                <a
                  href="/nasil-calisir"
                  className="rounded-full border border-slate-800/80 px-3 py-1.5 transition hover:border-emerald-400 hover:text-emerald-200"
                >
                  Nasıl çalışır
                </a>
                <a
                  href="/ozellikler"
                  className="rounded-full border border-slate-800/80 px-3 py-1.5 transition hover:border-emerald-400 hover:text-emerald-200"
                >
                  Özellikler
                </a>
                <a
                  href="/agent"
                  className="rounded-full border border-slate-800/80 px-3 py-1.5 transition hover:border-emerald-400 hover:text-emerald-200"
                >
                  Agent
                </a>
                <a
                  href="/fiyatlandirma"
                  className="rounded-full border border-slate-800/80 px-3 py-1.5 transition hover:border-emerald-400 hover:text-emerald-200"
                >
                  Fiyatlandırma
                </a>
                <a
                  href="/guvenlik"
                  className="rounded-full border border-slate-800/80 px-3 py-1.5 transition hover:border-emerald-400 hover:text-emerald-200"
                >
                  Güvenlik
                </a>
              </div>
            </section>

            {/* Özellikler – kullanıcı hikayelerinden önce */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-12 pb-10 sm:pt-16 sm:pb-14 text-slate-50">
              <header className="mb-6 text-center">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-300 mb-2">
                  Özellikler
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  Veri karmaşasından tablo netliğine giden tüm adımlar tek yerde.
                </h2>
                <p className="text-sm text-slate-300 max-w-3xl mx-auto">
                  BotExcel motoru OCR, doğrulama ve audit trail ile aynı akışta çalışır. Kısa tur için özellik sayfasına geç.
                </p>
              </header>
              <div className="text-center">
                <a
                  href="/ozellikler"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Detayları gör →
                </a>
              </div>
            </section>

            {/* Kullanıcı hikayeleri */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-10 sm:pb-14 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-400 mb-2">
                  Kullanıcı hikayeleri
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  "İşte ihtiyacım olan buydu" dedirten çözümler.
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl">
                  Finans, operasyon ve KOBİ ekipleri için gerçek hikayeler. Detaylar kullanıcı sayfasında.
                </p>
              </header>
              <div className="text-center">
                <a
                  href="/kullanicilar"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Hikayeleri gör →
                </a>
              </div>
            </section>

            {/* Çıktı kalitesi / Excel showcase */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-10 sm:pb-14 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-sky-300 mb-2">
                  Çıktı kalitesi
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  Karmaşık PDF’lerden sunuma hazır Excel dosyalarına.
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl">
                  Aynı motor, aynı temiz Excel çıktısı. Örnekler ve detaylar Özellikler sayfasında.
                </p>
              </header>
              <div className="text-center">
                <a
                  href="/ozellikler"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Detayları gör →
                </a>
              </div>
            </section>

            {/* Demo & etkileşimli upload alanı (görsel mock) */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-12 sm:pb-16 text-slate-50">
              <header className="mb-6 text-center sm:text-left">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-300 mb-2">
                  Canlı demo
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Kendi belgenizle deneyin.</h2>
                <p className="text-sm text-slate-300 max-w-2xl mx-auto sm:mx-0">
                  Dosya yükle → ayrıştır → Excel hazır akışını görmek için yükleme sayfasına git.
                </p>
              </header>

              <div className="text-center">
                <a
                  href="/upload"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Yükleme ekranına git →
                </a>
              </div>
            </section>

            {/* Öne çıkan yetkinlikler */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-10 sm:pb-14 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-sky-400 mb-2">
                  Öne çıkan yetkinlikler
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  Sadece dönüştürmek değil; doğrulamak, güzelleştirmek, anlamlandırmak.
                </h2>
              </header>
              <div className="text-center">
                <a
                  href="/ozellikler"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Detayları gör →
                </a>
              </div>
            </section>

            {/* Sosyal kanıt */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-10 sm:pb-14 text-slate-50">
              <div className="rounded-3xl border border-emerald-500/60 bg-gradient-to-br from-emerald-900/60 via-slate-900/80 to-slate-950 p-5 sm:p-6 text-center">
                <div className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-300">
                  Sosyal kanıt
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-emerald-50">
                  Kurumların kullandığı örnekler ve yorumlar kullanıcı sayfasında.
                </h2>
                <a
                  href="/kullanicilar"
                  className="mt-4 inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Hikayeleri gör →
                </a>
              </div>
            </section>

            {/* Ekibin hikayesi / misyon */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-12 sm:pb-16 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-300 mb-2">
                  Ekibin hikayesi
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  Veriye insani bir bakış getirmek için yola çıktık.
                </h2>
              </header>
              <div className="text-center text-sm text-slate-300">
                BotExcel ekibinin yolculuğu, denetim ve AI mühendisliğinin birleştiği noktada. Detaylar hikaye sayfasında.
              </div>
            </section>

            {/* Hazır Excel şablonları */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-10 sm:pb-14 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-300 mb-2">
                  Hazır Excel şablonları
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  En çok kullanılan raporlar tek tıkla indirilmeye hazır.
                </h2>
              </header>
              <div className="text-center">
                <a
                  href="/ozellikler"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Şablonları gör →
                </a>
              </div>
            </section>

            {/* Fiyatlandırma */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-10 sm:pb-14 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-300 mb-2">
                  Fiyatlandırma
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  Ekibiniz büyüdükçe ölçeklenen planlar.
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl">
                  İlk 3 dönüşüm ücretsiz; detaylı plan kartları fiyat sayfasında.
                </p>
              </header>
              <div className="text-center">
                <a
                  href="/fiyatlandirma"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Planları gör →
                </a>
              </div>
            </section>

            {/* Güven & KVKK / denetim bölümü */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-12 sm:pb-16 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-sky-300 mb-2">
                  Güven & KVKK
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Veriniz size aittir. Biz sadece düzenleriz.</h2>
                <p className="text-sm text-slate-300 max-w-2xl">
                  KVKK/GDPR, RBAC ve audit log detayları güvenlik sayfasında.
                </p>
              </header>
              <div className="text-center">
                <a
                  href="/guvenlik"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Güvenlik detayları →
                </a>
              </div>
            </section>

            {/* Teknik özellikler / API bölümü */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-12 sm:pb-16 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-300 mb-2">
                  Teknik özellikler & API
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  Geliştiriciler için: BotExcel API & CLI.
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl">
                  API/CLI örnekleri, entegrasyon notları Özellikler sayfasında.
                </p>
              </header>
              <div className="text-center">
                <a
                  href="/ozellikler"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Teknik detaylar →
                </a>
              </div>
            </section>

            {/* Blog / bilgi merkezi */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-10 sm:pb-14 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-300 mb-2">
                  Bilgi merkezi & blog
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  Yapay zekâ ile Excel otomasyonunun mutfağından notlar.
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl">
                  Blog ve kaynaklar özette. Liste için kaynak sayfasına geç.
                </p>
              </header>
              <div className="text-center">
                <a
                  href="/ozellikler"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Kaynakları gör →
                </a>
              </div>
            </section>

            {/* Kaynaklar */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-10 sm:pb-14 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-300 mb-2">
                  Kaynaklar
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  BotExcel’i ekibinize daha hızlı taşıyın.
                </h2>
              </header>
              <div className="text-center">
                <a
                  href="/ozellikler"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Kaynakları gör →
                </a>
              </div>
            </section>

            {/* SSS */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-12 sm:pb-16 text-slate-50">
              <header className="mb-6">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-300 mb-2">
                  Sık sorulan sorular
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  Kararsız kalanlar için son netleştirmeler.
                </h2>
              </header>
              <div className="text-center text-sm text-slate-300">
                Kısa FAQ özeti; detaylı sorular için güvenlik ve özellik sayfalarına geç.
              </div>
              <div className="mt-4 text-center">
                <a
                  href="/guvenlik"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Daha fazla SSS →
                </a>
              </div>
            </section>

            {/* Son çağrı */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-16 text-slate-50">
              <div className="rounded-3xl border border-emerald-500/70 bg-gradient-to-r from-slate-50 via-emerald-50 to-slate-100 px-4 sm:px-6 py-6 sm:py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-slate-900">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold mb-1">Bugün veri karmaşasını durdurun.</h2>
                  <p className="text-xs sm:text-sm max-w-xl">
                    BotExcel ile birkaç dakikada netliğe ulaşan finans, operasyon ve destek ekiplerinin arasına katılın.
                    PDF, görsel fiş ve ekstrelerinizi otomatik olarak sunuma hazır tablolara dönüştürün.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-emerald-500 text-emerald-950 text-xs sm:text-sm font-medium hover:bg-emerald-400"
                  >
                    Ücretsiz Dene
                  </Link>
                  <Link
                    href="/kurumsal-teklif"
                    className="inline-flex items-center justify-center px-3 py-1.5 rounded-full border border-emerald-600 text-xs sm:text-sm text-emerald-900 hover:bg-emerald-100"
                  >
                    Canlı Demo Talep Et
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotExcelScrollDemo;

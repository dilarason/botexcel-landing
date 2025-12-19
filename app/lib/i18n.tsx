"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Language = "tr" | "en";

// Translation strings
const translations = {
    tr: {
        // Navbar
        nav: {
            solutions: "Çözümler",
            pricing: "Fiyatlandırma",
            resources: "Kaynaklar",
            enterprise: "Kurumsal",
            login: "Giriş Yap",
            tryFree: "Ücretsiz Dene",
            themeLabel: "Görünüm & Dil",
        },
        // Solutions dropdown
        solutionsDropdown: {
            finance: "Finans & Denetim",
            financeDesc: "PDF faturaları ve ekstreleri Excel'e dönüştürün",
            operations: "Operasyon & Lojistik",
            operationsDesc: "Sevk irsaliyelerini ve kargo fişlerini otomatik kaydedin",
            sme: "KOBİ'ler",
            smeDesc: "Fiş ve makbuzlarınızı zahmetsizce takip edin",
            enterpriseSolutions: "Kurumsal Çözümler",
            enterpriseDesc: "On-prem AI ve özel entegrasyonlar",
        },
        // Resources dropdown
        resourcesDropdown: {
            apiDocs: "API Dokümantasyonu",
            apiDocsDesc: "REST API ve CLI referansı",
            security: "Güvenlik",
            securityDesc: "KVKK ve veri güvenliği politikaları",
            barcodeGuide: "Barkod & Stok Rehberi",
            barcodeGuideDesc: "Barkodlu stok takibi nasıl yapılır",
        },
        // Theme
        theme: {
            light: "Aydınlık",
            dark: "Karanlık",
            system: "Sistem",
        },
        // Hero Section
        hero: {
            tagline: "Veri karmaşasından tablo netliğine.",
            uploading: "Dosya yükleniyor…",
            analyzing: "Analiz ediliyor…",
            ready: "Excel hazır!",
        },
        // Use Cases Section
        useCases: {
            sectionTitle: "Çözümlerimiz",
            financeTitle: "Finans & Denetim",
            financeDesc: "PDF faturaları ve ekstreleri Excel'e dönüştürün",
            financeBullets: [
                "Fatura PDF'lerini 15 sn içinde tabloya dönüştürme",
                "Otomatik KDV ve tutar doğrulama",
                "GL mapping ile muhasebe entegrasyonu",
            ],
            operationsTitle: "Operasyon & Lojistik",
            operationsDesc: "Sevk irsaliyelerini ve kargo fişlerini otomatik kaydedin",
            operationsBullets: [
                "İrsaliye ve kargo fişlerini anında dijitalleştirme",
                "Barkod ve OCR ile otomatik ürün eşleme",
                "Stok/sevkiyat karşılaştırma raporları",
            ],
            smeTitle: "KOBİ'ler",
            smeDesc: "Fiş ve makbuzlarınızı zahmetsizce takip edin",
            smeBullets: [
                "Telefonla fiş fotoğrafı çekip yükleme",
                "Masraf kategorilendirme ile anlık gider raporu",
                "Basit arayüz, hızlı sonuç",
            ],
            enterpriseTitle: "Kurumsal Çözümler",
            enterpriseDesc: "On-prem AI ve özel entegrasyonlar",
            enterpriseBullets: [
                "On-prem yapay zekâ seçeneği",
                "ERP / CRM / BI entegrasyon kitleri",
                "Detaylı loglama ve raporlama",
            ],
        },
        // Capabilities Section
        capabilities: {
            sectionTag: "Yetenekler",
            sectionTitle: "BotExcel Ne Yapabilir?",
            items: [
                {
                    title: "Evrensel Dönüştürücü Motoru",
                    text: "PDF, TXT, e-posta ve fotoğraflardaki verileri temiz, biçimlendirilmiş Excel tablolara dönüştürür; sayı formatlarını ve para birimlerini otomatik düzeltir.",
                },
                {
                    title: "Doğruluk & Audit Trail",
                    text: "Her hücre kaynağı, satır numarası, model sürümü ve işlem tarihiyle kaydedilir; denetime hazır, hesap verilebilir yapay zekâ standardı sunar.",
                },
                {
                    title: "Barkod + Optik Tarama Analitiği",
                    text: "Barkod, QR ve optik karakter tanıma (OCR) ile kağıt üzerindeki metinleri yakalar; stok ve kargo tablolarını otomatik hazırlar.",
                },
                {
                    title: "API & CLI Otomasyonu",
                    text: "Tek AI motoru REST API veya komut satırı üzerinden çalışır; ERP, CRM ve BI entegrasyonlarını birkaç komutla hayata geçirin.",
                },
            ],
        },
        // Templates Section
        templates: {
            sectionTag: "Hazır Şablonlar",
            sectionTitle: "İndirin, Kullanın",
            items: [
                {
                    title: "Finans Dashboard",
                    text: "Pivot tablolar, dönemsel KDV özetleri ve nakit akışı grafikleriyle sunuma hazır finans raporu.",
                },
                {
                    title: "Stok & Sevkiyat İzleme",
                    text: "Barkodlu stok giriş-çıkış, kritik eşik uyarıları ve otomatik tedarik önerileri.",
                },
                {
                    title: "Audit & KVKK Kayıtları",
                    text: "Hücre bazlı değişiklik logu, kullanıcı aksiyonları ve denetim notları.",
                },
                {
                    title: "Satış / POS Konsolidasyonu",
                    text: "WhatsApp, e-ticaret ve POS verilerini normalize edip gelir tablosuna dönüştürür.",
                },
            ],
        },
        // Features Section
        features: {
            sectionTag: "Özellikler",
            sectionTitle: "Neden BotExcel?",
            items: [
                {
                    title: "Akıllı Dönüştürme Motoru",
                    desc: "PDF, DOCX, CSV veya görsel - tüm formatları tanır ve dakikalar içinde Excel tablolara dönüştürür.",
                },
                {
                    title: "Yapay Zekâ ile Alan Tanıma",
                    desc: "LLM destekli analiz; tarih, tutar, hesap gibi alanları otomatik algılar.",
                },
                {
                    title: "Gerçek Excel, Gerçek Formüller",
                    desc: "Formüller, koşullu biçimler ve özet tablolar otomatik olarak eklenir.",
                },
                {
                    title: "Audit Trail ve Güvenlik",
                    desc: "Her dönüşüm kayıt altındadır. KVKK ve GDPR uyumlu şekilde saklanır.",
                },
                {
                    title: "Doğrulama ve Tutarlılık Kontrolü",
                    desc: "AI, toplam değerleri, tekrar eden kayıtları ve hatalı alanları tespit eder.",
                },
                {
                    title: "Barkod ve Görsel Tanıma",
                    desc: "Kamera veya dosyadan barkod okutur, ürün bilgisini tanır ve Excel'e işler.",
                },
            ],
        },
        // Demo Section
        demo: {
            sectionTag: "Canlı demo",
            sectionTitle: "Şimdi dene — karşılaştır",
            sectionDesc: "Kendi belgenizle deneyin veya hazır örneğe tıklayın.",
            dropzoneTitle: "Dosya yükle",
            dropzoneSubtitle: "veya sürükle-bırak",
            sampleLabel: "Örnek fatura.pdf",
            sampleBadge: "Perakende satış özeti",
            uploading: "Dosya yükleniyor…",
            analyzing: "Analiz ediliyor…",
            ready: "Excel hazır!",
            download: "İndir",
            tryAnother: "Başka bir dosya",
            error: "Dönüşüm başarısız",
            tryAgain: "Tekrar dene",
            summaryLabel: "Özet",
        },
        // Output Quality Section
        outputQuality: {
            sectionTag: "Çıktı Kalitesi",
            sectionTitle: "Excel Kalitesi",
        },
        // Common
        common: {
            learnMore: "Daha Fazla",
            getStarted: "Başla",
        },
    },
    en: {
        // Navbar
        nav: {
            solutions: "Solutions",
            pricing: "Pricing",
            resources: "Resources",
            enterprise: "Enterprise",
            login: "Sign In",
            tryFree: "Try Free",
            themeLabel: "Theme & Language",
        },
        // Solutions dropdown
        solutionsDropdown: {
            finance: "Finance & Audit",
            financeDesc: "Convert PDF invoices and statements to Excel",
            operations: "Operations & Logistics",
            operationsDesc: "Automatically record shipping and cargo receipts",
            sme: "SMBs",
            smeDesc: "Effortlessly track your receipts and invoices",
            enterpriseSolutions: "Enterprise Solutions",
            enterpriseDesc: "On-prem AI and custom integrations",
        },
        // Resources dropdown
        resourcesDropdown: {
            apiDocs: "API Documentation",
            apiDocsDesc: "REST API and CLI reference",
            security: "Security",
            securityDesc: "GDPR and data security policies",
            barcodeGuide: "Barcode & Inventory Guide",
            barcodeGuideDesc: "How to set up barcode inventory tracking",
        },
        // Theme
        theme: {
            light: "Light",
            dark: "Dark",
            system: "System",
        },
        // Hero Section
        hero: {
            tagline: "From data chaos to table clarity.",
            uploading: "Uploading file…",
            analyzing: "Analyzing…",
            ready: "Excel ready!",
        },
        // Use Cases Section
        useCases: {
            sectionTitle: "Our Solutions",
            financeTitle: "Finance & Audit",
            financeDesc: "Convert PDF invoices and statements to Excel",
            financeBullets: [
                "Convert invoice PDFs to tables in 15 seconds",
                "Automatic VAT and amount validation",
                "GL mapping for accounting integration",
            ],
            operationsTitle: "Operations & Logistics",
            operationsDesc: "Automatically digitize shipping and cargo receipts",
            operationsBullets: [
                "Instantly digitize waybills and cargo receipts",
                "Auto product matching with barcode and OCR",
                "Stock/shipment comparison reports",
            ],
            smeTitle: "SMBs",
            smeDesc: "Effortlessly track your receipts and invoices",
            smeBullets: [
                "Snap and upload receipt photos from your phone",
                "Instant expense reports with auto-categorization",
                "Simple interface, fast results",
            ],
            enterpriseTitle: "Enterprise Solutions",
            enterpriseDesc: "On-prem AI and custom integrations",
            enterpriseBullets: [
                "On-premises AI deployment option",
                "ERP / CRM / BI integration kits",
                "Detailed logging and reporting",
            ],
        },
        // Capabilities Section
        capabilities: {
            sectionTag: "Capabilities",
            sectionTitle: "What Can BotExcel Do?",
            items: [
                {
                    title: "Universal Converter Engine",
                    text: "Converts data from PDFs, TXT, emails, and photos into clean, formatted Excel tables; auto-corrects number formats and currencies.",
                },
                {
                    title: "Accuracy & Audit Trail",
                    text: "Every cell is logged with source, row number, model version, and timestamp; audit-ready, accountable AI standard.",
                },
                {
                    title: "Barcode + Optical Scanning Analytics",
                    text: "Captures text from paper using barcode, QR, and OCR; auto-creates stock and cargo tables.",
                },
                {
                    title: "API & CLI Automation",
                    text: "Single AI engine works via REST API or CLI; enable ERP, CRM, and BI integrations with a few commands.",
                },
            ],
        },
        // Templates Section
        templates: {
            sectionTag: "Ready Templates",
            sectionTitle: "Download & Use",
            items: [
                {
                    title: "Finance Dashboard",
                    text: "Presentation-ready finance report with pivot tables, periodic VAT summaries, and cash flow charts.",
                },
                {
                    title: "Stock & Shipment Tracking",
                    text: "Barcode-based stock in/out, critical threshold alerts, and auto-replenishment suggestions.",
                },
                {
                    title: "Audit & GDPR Records",
                    text: "Cell-level change logs, user actions, and audit notes in one file.",
                },
                {
                    title: "Sales / POS Consolidation",
                    text: "Normalizes WhatsApp, e-commerce, and POS data into an income statement.",
                },
            ],
        },
        // Features Section
        features: {
            sectionTag: "Features",
            sectionTitle: "Why BotExcel?",
            items: [
                {
                    title: "Smart Conversion Engine",
                    desc: "PDF, DOCX, CSV, or image - recognizes all formats and converts to Excel in minutes.",
                },
                {
                    title: "AI-Powered Field Recognition",
                    desc: "LLM-powered analysis; auto-detects dates, amounts, accounts and more.",
                },
                {
                    title: "Real Excel, Real Formulas",
                    desc: "Formulas, conditional formatting, and summary tables are added automatically.",
                },
                {
                    title: "Audit Trail & Security",
                    desc: "Every conversion is logged. Stored in GDPR-compliant manner.",
                },
                {
                    title: "Validation & Consistency Check",
                    desc: "AI detects total values, duplicate records, and erroneous fields.",
                },
                {
                    title: "Barcode & Visual Recognition",
                    desc: "Scan barcodes from camera or file, recognize products, and write to Excel.",
                },
            ],
        },
        // Demo Section
        demo: {
            sectionTag: "Live Demo",
            sectionTitle: "Try Now — Compare",
            sectionDesc: "Try with your own document or click a sample.",
            dropzoneTitle: "Upload file",
            dropzoneSubtitle: "or drag & drop",
            sampleLabel: "Sample invoice.pdf",
            sampleBadge: "Retail sales summary",
            uploading: "Uploading file…",
            analyzing: "Analyzing…",
            ready: "Excel ready!",
            download: "Download",
            tryAnother: "Try another file",
            error: "Conversion failed",
            tryAgain: "Try again",
            summaryLabel: "Summary",
        },
        // Output Quality Section
        outputQuality: {
            sectionTag: "Output Quality",
            sectionTitle: "Excel Quality",
        },
        // Common
        common: {
            learnMore: "Learn More",
            getStarted: "Get Started",
        },
    },
} as const;

// Use a more flexible type that works with both languages
export type Translations = (typeof translations)[Language];

interface I18nContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [lang, setLangState] = useState<Language>("tr");

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            const stored = localStorage.getItem("lang") as Language | null;
            if (stored && (stored === "tr" || stored === "en")) {
                setLangState(stored);
            }
        }, 0);
        return () => window.clearTimeout(timeoutId);
    }, []);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem("lang", newLang);
    };

    const t = translations[lang];

    return (
        <I18nContext.Provider value={{ lang, setLang, t }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = (): I18nContextType => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error("useI18n must be used within an I18nProvider");
    }
    return context;
};

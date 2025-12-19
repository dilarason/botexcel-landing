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
        // User Stories Section
        userStories: {
            sectionTag: "Kullanıcı hikayeleri",
            sectionTitle: "\"İşte ihtiyacım olan buydu\" dedirten çözümler.",
            sectionDesc: "BotExcel yalnızca dönüştürmekle kalmaz; doğrulama, audit trail ve zengin Excel çıktılarıyla finans, operasyon ve KOBİ ekiplerine değer katıyor.",
            items: [
                {
                    title: "Finans & Denetim ekipleri",
                    description: "Ay sonunda yüzlerce fatura ve banka ekstresiyle uğraşan finans yöneticileri, BotExcel sayesinde birkaç dakikada birleşik ve doğrulanmış tabloya ulaşıyor.",
                    bullets: ["PDF → Excel dönüşümü 3 dakika altında", "Yanlış toplam riskine karşı akıllı uyarılar", "Audit trail ile izlenebilir hücreler"],
                },
                {
                    title: "Operasyon & Lojistik",
                    description: "Sevk irsaliyelerini ve kargo fişlerini kamerayla okut, stok tablosu otomatik güncellensin; eksik ürünler için eylem listesi hazır olsun.",
                    bullets: ["Barkod ve optik karakter tanıma ile tek seferde kayıt", "Gerçek zamanlı stok ve tedarik görünürlüğü", "Operasyonel raporlar dakikalar içinde"],
                },
                {
                    title: "KOBİ'ler",
                    description: "Manavdan kırtasiyeye tüm küçük işletmeler, fiş ve makbuzlarını BotExcel'e yükleyerek günlük satış ve giderlerini zahmetsizce takip ediyor.",
                    bullets: ["Buluta bağımlı olmayan masaüstü zekâ", "Logo, Mikro, Paraşüt entegrasyonları", "Basit Excel şablonlarıyla satış & stok takibi"],
                },
                {
                    title: "Kurumsal / Enterprise",
                    description: "Bankacılık ve denetim ekipleri, yerel yapay zekâ ve ayrıntılı erişim kontrolleri sayesinde KVKK uyumlu veri temizleme süreçlerini otomatikleştiriyor.",
                    bullets: ["On-prem yapay zekâ seçeneği", "ERP / CRM / BI entegrasyon kitleri", "Detaylı loglama ve raporlama"],
                },
            ],
        },
        // Sections texts
        sections: {
            featuresHeader: "Veri karmaşasından tablo netliğine giden tüm adımlar tek yerde.",
            featuresSubheader: "BotExcel belgeleri yalnızca Excel'e dönüştürmekle kalmaz; yapay zekâ ile anlar, doğrular, açıklar ve güvenle saklanabilir hale getirir.",
            featuresFooter: "Manuel veri girişi, dosya birleştirme ve tablo temizleme derdine son. BotExcel, belgelerinizi dakikalar içinde anlamlı, doğrulanmış ve paylaşılabilir Excel tablolara dönüştürür.",
            featuresExtra: "AI + PDF + Görsel + Audit + Excel",
            uploadCta: "Belgeni yükle, 3 ücretsiz dönüşüm al",
            uploadCtaDesc: "Animasyon bitti, şimdi tek aksiyonla kendi belgeni dene. BotExcel karmaşık dosyaları dakikalar içinde Excel'e çevirir.",
            demoTag: "Canlı demo",
            demoTitle: "Kendi belgenizle deneyin.",
            demoDesc: "Ürüne karar vermeden önce ne göreceğinizi bilmek istersiniz. BotExcel, ilk temasınızı olabildiğince zahmetsiz hale getirir: Belgenizi seçin ya da hazır demo örneklerinden birini kullanın, birkaç saniye içinde örnek Excel çıktısını görün.",
            capabilitiesTag: "Öne çıkan yetkinlikler",
            capabilitiesTitle: "Sadece dönüştürmek değil; doğrulamak, güzelleştirmek, anlamlandırmak.",
            socialProofTag: "Sosyal kanıt",
            socialProofTitle: "Tİ İthalat & İhracat ve yüzlerce kurum BotExcel'e güveniyor.",
            socialProofQuote: "PDF dekontlarını ve banka ekstrelerini BotExcel ile 8 dakikada rapora dönüştürüyoruz. Audit trail sayesinde denetim raporları hiç olmadığı kadar hızlı hazırlandı.",
            socialProofAuthor: "Tİ İthalat & İhracat",
        },
        // Output Quality Section
        outputQuality: {
            sectionTag: "Çıktı Kalitesi",
            sectionTitle: "Karmaşık PDF'lerden, sunuma hazır Excel dosyalarına.",
            sectionDesc: "Çoğu araç \"PDF → Excel\" dediğinde sana yeni bir temizlik işi bırakır. BotExcel ise yalnızca alanları tanımaz; sayısal formatları, para birimlerini ve tarih alanlarını da akıllıca düzeltir.",
            beforeLabel: "Öncesi",
            beforeItems: [
                "Satır kaymaları, birleşik hücreler, bozuk başlıklar.",
                "Tutarsız tarih formatları ve para birimleri.",
                "Eksik veya tutmayan KDV / genel toplamlar.",
            ],
            beforeFile: "fatura_final_son2(3).pdf – 14 sayfa, manuel kontrol gerektirir.",
            afterLabel: "Sonrası (BotExcel ile)",
            afterItems: [
                "Net sütun başlıkları ve tutarlı veri formatları.",
                "Otomatik KDV, ara toplam ve genel toplam hesaplamaları.",
                "KDV özeti, nakit akışı ve müşteri bazlı gelir için hazır pivot ve özet tablolar.",
            ],
            afterFile: "fatura_ozet_2025Q1.xlsx – tek sayfada yönetim sunumuna hazır özet.",
            comparison: "14 sayfalık fatura yığını ≈ 45 dakika manuel temizlik yerine,",
            comparisonHighlight: "BotExcel ile 2 dakikada sunuma hazır Excel.",
            downloadCta: "Örnek çıktıyı gör",
        },
        // Team Story Section
        teamStory: {
            sectionTag: "Ekibin hikayesi",
            sectionTitle: "Veriye insani bir bakış getirmek için yola çıktık.",
            paragraph1: "BotExcel, \"veri işi\"nin sadece satırlardan ibaret olmadığını bilen bir ekip tarafından geliştirildi. Bir tarafında yıllarca bağımsız denetim ve finans raporlamada çalışmış uzmanlar, diğer tarafında üretici yapay zekâ modelleri üzerine çalışan mühendisler var.",
            paragraph2: "Amacımız, ekiplerinizi manuel Excel işlerinden kurtarıp, zamanlarını asıl değer ürettikleri kararlara ayırmalarını sağlamak.",
            bullet1: "İlk satırlarımızı, bir denetim ekibinin 3 günlük işini 40 dakikaya indirmek için yazdık.",
            bullet2: "BotExcel'in çekirdeğinde, Gemma tabanlı AI ve denetime hazır loglama mantığı birlikte çalışır.",
            workWithTitle: "Kimlerle çalışıyoruz?",
            workWithDesc: "Finans ekipleri, operasyon liderleri, denetim uzmanları ve geliştiricilerle aynı masada oturup gerçek kullanım senaryolarına göre ürün geliştiriyoruz.",
            socialTrustTitle: "Sosyal güven",
            socialTrustDesc: "Ekibi daha yakından tanımak için BotExcel kurucularını ve ürün ekibini LinkedIn üzerinden takip edebilirsiniz.",
        },
        // Templates Section Headers
        templatesSection: {
            sectionTag: "Hazır Excel şablonları",
            sectionTitle: "Direkt indirin, hemen kullanın.",
            sectionDesc: "BotExcel ile oluşturabileceklerinizi görmek için hazır şablonlarımıza göz atın.",
        },
        // Demo Uploader
        demoUploader: {
            selectTitle: "Belgenizi seçin veya hazır örneklerden birini kullanın",
            supportedFormats: "PDF, JPG, PNG, XLSX, CSV desteklenir. Maksimum 10 MB.",
            selectButton: "Belge seçin",
            emptyState: "Henüz dosya seçilmedi. Belge seçerek demo sürecini başlatın.",
            resetButton: "Demo sıfırla",
            processing: "İşleniyor...",
            step1: "1. Yükleniyor",
            step1Desc: "Belgeniz analiz edilmek üzere güvenli sunuculara aktarılıyor.",
            step2: "2. Alanlar tanımlanıyor",
            step2Desc: "AI motoru, belgedeki alan ve değerleri tanımlıyor.",
            step3: "3. Excel hazır",
            step3Desc: "Tablo, formüller ve özetlerle Excel'e aktarılıyor; indirmeye hazır.",
            downloadExcel: "Excel'i indir",
            disclaimerTitle: "Demo Modu Hakkında Not",
            disclaimerText: "Bu canlı demo gerçek dönüştürme yerine örnek veriyi gösterir.",
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
        // User Stories Section
        userStories: {
            sectionTag: "User Stories",
            sectionTitle: "Solutions that make you say \"This is exactly what I needed.\"",
            sectionDesc: "BotExcel doesn't just convert; it validates, provides audit trails, and delivers rich Excel outputs that add value to finance, operations, and SMB teams.",
            items: [
                {
                    title: "Finance & Audit Teams",
                    description: "Finance managers dealing with hundreds of invoices and bank statements at month-end get unified, validated tables in minutes with BotExcel.",
                    bullets: ["PDF to Excel conversion in under 3 minutes", "Smart alerts for incorrect totals", "Traceable cells with audit trail"],
                },
                {
                    title: "Operations & Logistics",
                    description: "Scan shipping documents and cargo receipts with camera, auto-update stock tables; prepare action lists for missing items.",
                    bullets: ["One-time record with barcode and OCR", "Real-time stock and supply visibility", "Operational reports in minutes"],
                },
                {
                    title: "SMBs",
                    description: "From grocery stores to stationery shops, all small businesses effortlessly track daily sales and expenses by uploading receipts to BotExcel.",
                    bullets: ["Desktop AI without cloud dependency", "Logo, Mikro, Paraşüt integrations", "Simple Excel templates for sales & stock tracking"],
                },
                {
                    title: "Enterprise",
                    description: "Banking and audit teams automate GDPR-compliant data cleansing processes with local AI and detailed access controls.",
                    bullets: ["On-prem AI option", "ERP / CRM / BI integration kits", "Detailed logging and reporting"],
                },
            ],
        },
        // Sections texts
        sections: {
            featuresHeader: "All steps from data chaos to table clarity in one place.",
            featuresSubheader: "BotExcel doesn't just convert documents to Excel; it understands, validates, explains with AI, and makes them securely storable.",
            featuresFooter: "Say goodbye to manual data entry, file merging, and table cleaning. BotExcel transforms your documents into meaningful, validated, shareable Excel tables in minutes.",
            featuresExtra: "AI + PDF + Image + Audit + Excel",
            uploadCta: "Upload your document, get 3 free conversions",
            uploadCtaDesc: "Animation complete, now try your own document with one action. BotExcel converts complex files to Excel in minutes.",
            demoTag: "Live Demo",
            demoTitle: "Try with your own document.",
            demoDesc: "You want to see what you'll get before committing. BotExcel makes your first contact as effortless as possible: Select your document or use a ready demo sample, and see the example Excel output in seconds.",
            capabilitiesTag: "Key Capabilities",
            capabilitiesTitle: "Not just converting; validating, beautifying, making it meaningful.",
            socialProofTag: "Social Proof",
            socialProofTitle: "Tİ Import & Export and hundreds of companies trust BotExcel.",
            socialProofQuote: "We convert PDF receipts and bank statements to reports in 8 minutes with BotExcel. Thanks to audit trail, audit reports are prepared faster than ever.",
            socialProofAuthor: "Tİ Import & Export",
        },
        // Output Quality Section
        outputQuality: {
            sectionTag: "Output Quality",
            sectionTitle: "From complex PDFs to presentation-ready Excel files.",
            sectionDesc: "Most tools leave you with a cleanup job when they say \"PDF → Excel\". BotExcel not only recognizes fields; it also smartly corrects number formats, currencies, and date fields.",
            beforeLabel: "Before",
            beforeItems: [
                "Row shifts, merged cells, broken headers.",
                "Inconsistent date formats and currencies.",
                "Missing or incorrect VAT / grand totals.",
            ],
            beforeFile: "invoice_final_v2(3).pdf – 14 pages, requires manual review.",
            afterLabel: "After (with BotExcel)",
            afterItems: [
                "Clear column headers and consistent data formats.",
                "Automatic VAT, subtotal, and grand total calculations.",
                "Ready pivot and summary tables for VAT summary, cash flow, and customer-based revenue.",
            ],
            afterFile: "invoice_summary_2025Q1.xlsx – management-ready summary on a single page.",
            comparison: "14-page invoice pile ≈ 45 minutes of manual cleanup, instead:",
            comparisonHighlight: "Presentation-ready Excel in 2 minutes with BotExcel.",
            downloadCta: "View sample output",
        },
        // Team Story Section
        teamStory: {
            sectionTag: "Our Story",
            sectionTitle: "We set out to bring a human perspective to data.",
            paragraph1: "BotExcel was developed by a team that understands \"data work\" is more than just rows. On one side, there are experts who have worked in independent audit and financial reporting for years. On the other, engineers working on generative AI models.",
            paragraph2: "Our goal is to free your teams from manual Excel tasks, allowing them to spend their time on decisions that create real value.",
            bullet1: "We wrote our first lines to reduce a 3-day audit team job to 40 minutes.",
            bullet2: "At the core of BotExcel, Gemma-based AI and audit-ready logging logic work together.",
            workWithTitle: "Who do we work with?",
            workWithDesc: "We sit at the same table with finance teams, operations leaders, audit experts, and developers to develop products based on real use cases.",
            socialTrustTitle: "Social Trust",
            socialTrustDesc: "To get to know the team better, you can follow BotExcel founders and product team on LinkedIn.",
        },
        // Templates Section Headers
        templatesSection: {
            sectionTag: "Ready Excel Templates",
            sectionTitle: "Download directly, use immediately.",
            sectionDesc: "Check out our ready templates to see what you can create with BotExcel.",
        },
        // Demo Uploader
        demoUploader: {
            selectTitle: "Select your document or use one of the ready samples",
            supportedFormats: "PDF, JPG, PNG, XLSX, CSV supported. Maximum 10 MB.",
            selectButton: "Select Document",
            emptyState: "No file selected yet. Select a document to start the demo process.",
            resetButton: "Reset Demo",
            processing: "Processing...",
            step1: "1. Uploading",
            step1Desc: "Your document is being securely transferred for analysis.",
            step2: "2. Identifying Fields",
            step2Desc: "AI engine is identifying fields and values in the document.",
            step3: "3. Excel Ready",
            step3Desc: "Being exported to Excel with tables, formulas, and summaries; ready to download.",
            downloadExcel: "Download Excel",
            disclaimerTitle: "Note About Demo Mode",
            disclaimerText: "This live demo shows sample data instead of actual conversion.",
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

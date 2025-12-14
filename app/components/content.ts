// Ortak içerik verileri – mevcut metinler yeniden kullanılır.

export const featureCards = [
  {
    title: "Akıllı Dönüştürme Motoru",
    desc: "PDF, DOCX, CSV veya görsel fark etmez - BotExcel tüm formatları tanır ve dakikalar içinde okunabilir Excel tablolara dönüştürür.",
  },
  {
    title: "Yapay Zekâ ile Alan Tanıma",
    desc: "LLM destekli analiz; belge içindeki tarih, tutar, hesap, firma gibi alanları otomatik algılar ve doğru sütunlara yerleştirir.",
  },
  {
    title: "Gerçek Excel, Gerçek Formüller",
    desc: "Sadece veri değil, yapısıyla anlamlı bir Excel üretir: formüller, koşullu biçimler ve özet tablolar otomatik olarak eklenir.",
  },
  {
    title: "Audit Trail ve Güvenlik",
    desc: "Her dönüşüm kim tarafından, ne zaman yapıldı - kayıt altındadır. Veriler şifreli, KVKK ve GDPR uyumlu şekilde saklanır.",
  },
  {
    title: "Doğrulama ve Tutarlılık Kontrolü",
    desc: "AI, tablo içindeki toplam değerleri, tekrar eden kayıtları ve hatalı alanları tespit ederek tutarlılık konusunda uyarır.",
  },
  {
    title: "Barkod ve Görsel Tanıma",
    desc: "Kamera veya dosyadan barkod okutur, ürün bilgisini tanır ve doğrudan Excel'e işler - özellikle küçük işletmeler için ideal.",
  },
];

export const userStories = [
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

export const capabilityCards = [
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

export const templateCards = [
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

export const resourceCards = [
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

export const faqItems = [
  {
    question: "Verilerim nereye kaydediliyor?",
    answer:
      "Verileriniz tercih ettiğiniz bölgedeki (Türkiye veya EU) veri merkezlerinde saklanır. Varsayılan ayarda, yalnızca işleme için gerekli minimum süre boyunca tutulur ve isterseniz tüm belgeler işleme sonrası otomatik olarak silinebilir.",
  },
  {
    question: "BotExcel hangi dosya türlerini destekliyor?",
    answer:
      "PDF, JPG, PNG, Excel (XLSX), CSV ve yaygın banka ekstre formatlarını destekliyoruz. Özel formatlar için entegrasyon ekibimizle birlikte çalışabiliyoruz.",
  },
  {
    question: "AI yanlış alan tespit ederse ne olur?",
    answer:
      "Hücre bazlı audit trail sayesinde, her değişikliğin kaynağını görebilir ve tek tıkla eski değere dönebilirsiniz. Ayrıca doğrulama kurallarıyla (örn. KDV oranı, toplam tutar) otomatik uyarılar alırsınız.",
  },
  {
    question: "Çevrimdışı (on-prem) kullanabilir miyim?",
    answer:
      "Evet. Kurumsal müşteriler için tüm AI motorunu, loglama altyapısını ve entegrasyon katmanını kendi veri merkezinize kurabileceğimiz on-prem paket sunuyoruz.",
  },
];

export const workflowSteps = [
  {
    title: "1. Yükleniyor",
    text: "Belgeniz şifreli bağlantı üzerinden BotExcel motoruna iletilir.",
  },
  {
    title: "2. Alanlar tanımlanıyor",
    text: "Tablo yapısı, metin blokları ve toplam alanları otomatik tespit edilir.",
  },
  {
    title: "3. Excel hazır",
    text: "Sonuç dosyasını önizleyebilir, indirebilir veya ekibinizle paylaşabilirsiniz.",
  },
];

export const blogPosts = [
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

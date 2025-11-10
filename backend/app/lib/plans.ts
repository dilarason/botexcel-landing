export type LandingPlan = {
  name: string;
  price: string;
  limit: string;
  tagline: string;
  bullets: string[];
  highlight?: boolean;
  contact?: boolean;
  href: string;
  cta: string;
};

export type PurchasePlan = {
  name: string;
  price: string;
  limit: string;
  description: string;
  perks: string[];
  href: string;
  cta: string;
  highlight?: boolean;
  contact?: boolean;
};

export const mockUser = {
  name: "Aylin Yılmaz",
  email: "aylin@botexcel.com",
  currentPlan: "Free (3 dosya/ay)",
};

export const landingPlans: LandingPlan[] = [
  {
    name: "Free",
    price: "0 ₺ / ay",
    limit: "Ayda 3 dosya",
    tagline: "Başlamak isteyen ekipler için risksiz başlangıç.",
    bullets: ["3 dosya/ay", "Temel OCR", "Community desteği"],
    href: "/register",
    cta: "Ücretsiz Dene",
  },
  {
    name: "Plus",
    price: "299 ₺ / ay",
    limit: "Ayda 20 dosya",
    tagline: "AI etiketleme + audit trail + öncelikli destek.",
    bullets: [
      "Ayda 20 dosya",
      "Gelişmiş OCR + AI etiketleme",
      "Öncelikli destek ve audit trail",
    ],
    highlight: true,
    href: "/register?plan=plus",
    cta: "Plus'a Geç",
  },
  {
    name: "Pro",
    price: "799 ₺ / ay",
    limit: "Ayda 200 dosya",
    tagline: "Finans ve operasyon ekipleri için hazır şablon + API.",
    bullets: ["Ayda 200 dosya", "Özel şablon + API erişimi", "Takım bazlı roller"],
    href: "/register?plan=pro",
    cta: "Pro'yu Seç",
  },
  {
    name: "Business",
    price: "Özel fiyat",
    limit: "Talebe göre dosya limiti",
    tagline: "Ekibiniz için özel paketleri birlikte tasarlayalım.",
    bullets: [
      "Özel SLA ve raporlama",
      "Dedicated müşteri temsilcisi",
      "Yerinde veya özel entegrasyon desteği",
    ],
    contact: true,
    href: "mailto:sales@botexcel.com",
    cta: "Ekiple Görüş",
  },
];

export const purchasePlans: PurchasePlan[] = [
  {
    name: "Free",
    price: "0 ₺ / ay",
    limit: "Ayda 3 dosya",
    description:
      "Küçük ekipler için risksiz başlangıç: OCR, temel AI ve BotExcel arayüzünü keşfetme imkânı.",
    perks: ["3 dosya/ay", "Temel OCR", "Community desteği"],
    href: "/register",
    cta: "Ücretsiz Dene",
  },
  {
    name: "Plus",
    price: "299 ₺ / ay",
    limit: "Ayda 20 dosya",
    description:
      "AI etiketleme, audit trail ve öncelikli destek ile dinamik ekipler için ideal.",
    perks: [
      "20 dosya/ay dönüştürme",
      "AI etiketleme + gelişmiş OCR",
      "Öncelikli destek ve audit trail",
    ],
    highlight: true,
    href: "/register?plan=plus",
    cta: "Plus'a Geç",
  },
  {
    name: "Pro",
    price: "799 ₺ / ay",
    limit: "Ayda 200 dosya",
    description:
      "Finans, operasyon ve entegrasyon ekipleri için özel şablonlar, API erişimi ve takım bazlı yetkiler.",
    perks: ["200 dosya/ay", "Özel şablon + API erişimi", "Takım bazlı rol yönetimi"],
    href: "/register?plan=pro",
    cta: "Pro'yu Seç",
  },
  {
    name: "Business",
    price: "İletişime geçin",
    limit: "Talebinize göre",
    description:
      "İhtiyaçlarınıza göre bir paket oluşturmak için ekibimizle iletişime geçin; dosya limiti, SLA ve raporlama sürecini birlikte tasarlayalım.",
    perks: [
      "Özel SLA ve raporlama",
      "Dedicated müşteri temsilcisi",
      "Yerinde veya özel entegrasyon desteği",
    ],
    contact: true,
    href: "mailto:sales@botexcel.com",
    cta: "Ekiple Görüş",
  },
];

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
    tagline: "KDV, temel fatura ve stok denemeleri için risksiz başlangıç.",
    bullets: ["3 dosya/ay", "Temel OCR + AI", "Community desteği"],
    href: "/register",
    cta: "Ücretsiz Dene",
  },
  {
    name: "Starter",
    price: "149 ₺ / ay",
    limit: "Ayda 20 dosya",
    tagline: "Küçük işletmeler ve freelancer'lar için düzenli kullanım.",
    bullets: [
      "20 dosya/ay",
      "Standart dönüşüm hızı",
      "Gelişmiş dashboard şablonları",
    ],
    href: "/register?plan=starter",
    cta: "Starter'ı Seç",
  },
  {
    name: "Pro",
    price: "249 ₺ / ay",
    limit: "Ayda 60 dosya",
    tagline: "Finans ve operasyon ekipleri için KDV, e-arşiv, stok şablonları + API.",
    bullets: [
      "60 dosya/ay",
      "Özel şablon + API erişimi",
      "Öncelikli destek ve audit trail",
    ],
    highlight: true,
    href: "/register?plan=pro",
    cta: "Pro'yu Seç",
  },
  {
    name: "Business",
    price: "799 ₺ / ay",
    limit: "Ayda 200 dosya",
    tagline: "Ekipler için yüksek hacimli kullanım, SLA ve özel entegrasyon.",
    bullets: [
      "200 dosya/ay",
      "Özel SLA ve raporlama",
      "Dedicated müşteri temsilcisi",
    ],
    href: "/register?plan=business",
    cta: "Business'ı Seç",
  },
  {
    name: "Enterprise",
    price: "Özel teklif",
    limit: "Sınırsız + özel SLA",
    tagline: "Denetim gereksinimi olan kurumsal ekipler için.",
    bullets: [
      "Sınırsız kullanım & denetim gereksinimleri",
      "Yerinde/özel entegrasyon desteği",
      "Gelişmiş güvenlik kontrolleri",
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
      "KDV, temel fatura ve stok denemeleri için risksiz başlangıç: temel OCR + AI.",
    perks: ["3 dosya/ay", "Temel OCR + AI", "Community desteği"],
    href: "/register",
    cta: "Ücretsiz Dene",
  },
  {
    name: "Starter",
    price: "149 ₺ / ay",
    limit: "Ayda 20 dosya",
    description:
      "Küçük işletmeler ve freelancer'lar için düzenli ama düşük hacimli kullanım.",
    perks: ["20 dosya/ay", "Standart dönüşüm hızı", "Gelişmiş dashboard şablonları"],
    href: "/register?plan=starter",
    cta: "Starter'ı Seç",
  },
  {
    name: "Pro",
    price: "249 ₺ / ay",
    limit: "Ayda 60 dosya",
    description:
      "Finans ve operasyon ekipleri için KDV, e-arşiv, stok şablonları ve API erişimi.",
    perks: ["60 dosya/ay", "Özel şablon + API erişimi", "Öncelikli destek"],
    highlight: true,
    href: "/register?plan=pro",
    cta: "Pro'yu Seç",
  },
  {
    name: "Business",
    price: "799 ₺ / ay",
    limit: "Ayda 200 dosya",
    description:
      "Ekipler için yüksek hacimli kullanım, özel SLA, raporlama ve entegrasyon desteği.",
    perks: ["200 dosya/ay", "Özel SLA ve raporlama", "Dedicated müşteri temsilcisi"],
    href: "/register?plan=business",
    cta: "Business'ı Seç",
  },
  {
    name: "Enterprise",
    price: "Özel teklif",
    limit: "Sınırsız + denetim",
    description:
      "Regülasyon ve denetim gerektiren kurumsal ekipler için güvenlik kontrollü, sınırsız kullanım.",
    perks: [
      "Sınırsız kullanım",
      "Gelişmiş güvenlik ve denetim",
      "Yerinde/özel entegrasyon desteği",
    ],
    contact: true,
    href: "mailto:sales@botexcel.com",
    cta: "Ekiple Görüş",
  },
];

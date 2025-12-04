"use client";

import Link from "next/link";
import { CustomOfferForm } from "./CustomOfferForm";
import { useAuth } from "./providers/AuthProvider";
import { usePlan } from "../hooks/usePlan";

// ---- Mini SVG ikonlar ----

function IconFree() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
    >
      <path d="M12 3.5l2.3 4.7 5.2.8-3.8 3.8.9 5.3L12 15.8 7.4 18l.9-5.3L4.5 9l5.2-.8L12 3.5z" />
    </svg>
  );
}

function IconPro() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]"
    >
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 6v6" />
      <path d="M9 3h6" strokeWidth="1" />
    </svg>
  );
}

function IconBusiness() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]"
    >
      <circle cx="9" cy="10" r="3" />
      <circle cx="15" cy="10" r="3" />
      <path d="M4 18c0-3 2-5 5-5" />
      <path d="M20 18c0-3-2-5-5-5" />
    </svg>
  );
}

function IconEnterprise() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="drop-shadow-[0_0_10px_rgba(250,250,250,0.4)]"
    >
      <rect x="4" y="9" width="4" height="11" />
      <rect x="10" y="4" width="4" height="16" />
      <rect x="16" y="11" width="4" height="9" />
      <path d="M4 20h16" />
    </svg>
  );
}

// ---- Plan verileri ----

const plans = [
  {
    id: "free",
    name: "Free",
    badge: "Deneme",
    quota: "3 dosya / ay",
    price: "0 TL",
    period: "/ay",
    description: "Ürünü denemek ve küçük işler için ideal.",
    highlights: [
      "Ayda 3 belgeye kadar",
      "Temel AI alan çıkarımı",
      "Basit Excel çıktısı",
    ],
    href: "/register?plan=free",
    ctaLabel: "Ücretsiz Başla",
    accentClasses:
      "border-emerald-500/80 bg-gradient-to-b from-emerald-950/60 to-slate-950",
    icon: IconFree,
  },
  {
    id: "pro",
    name: "Pro",
    badge: "Takımlar",
    quota: "200 dosya / ay",
    price: "599 TL",
    period: "/ay",
    description: "Finans, operasyon ve raporlama ekipleri için.",
    highlights: [
      "Ayda 200 belgeye kadar",
      "Hızlı dönüşüm kuyruğu",
      "Gelişmiş Excel özetleri",
    ],
    href: "/register?plan=pro",
    ctaLabel: "Pro ile Devam Et",
    accentClasses: "border-emerald-500/80 bg-slate-900/70",
    icon: IconPro,
  },
  {
    id: "business",
    name: "Business",
    badge: "Takım bazlı",
    quota: "2000 dosya / ay",
    price: "1.700 TL",
    period: "/ay",
    description: "Büyüyen ekipler ve düzenli iş akışları için.",
    highlights: [
      "Ayda 2000 belgeye kadar",
      "Çoklu kullanıcı desteği",
      "Özel dashboard & entegrasyonlar",
    ],
    href: "/register?plan=business",
    ctaLabel: "Business ile Devam Et",
    accentClasses: "border-emerald-300/80 bg-slate-900/70",
    icon: IconBusiness,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    badge: "Kurumsal",
    quota: "Sınırsız / çok yüksek kullanım",
    price: "Teklif",
    period: "",
    description: "KVKK, entegrasyon ve SLA gerektiren kurumsal kullanım.",
    highlights: [
      "Sınırsız / çok yüksek belge hacmi",
      "Özel entegrasyon & API",
      "Kurumsal SLA ve güvenlik",
    ],
    href: "/kurumsal-teklif",
    ctaLabel: "Özel Teklif Al",
    accentClasses: "border-emerald-200/70 bg-slate-900/70",
    icon: IconEnterprise,
  },
];

export function PricingSection() {
  const { isAuthenticated } = useAuth();
  const { planInfo } = usePlan();
  const currentPlanId = planInfo?.plan_id;
  return (
    <section
      id="pricing"
      className="border-t border-slate-800 bg-[radial-gradient(circle_at_top,_#020617,_#020617_60%)] py-16 md:py-20 text-slate-50"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
        {/* Başlık alanı */}
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
            FİYATLANDIRMA
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Planını seç, veri karmaşasını geride bırak.
          </h2>
          <p className="text-sm md:text-base text-slate-300">
            Free planla ayda 3 belgeyi ücretsiz dönüştür. Daha fazlası için Starter, Pro, Business
            veya Enterprise ile belge hacmini ve ekip kapasiteni büyütebilirsin.
          </p>
        </div>

        {/* Fiyat kartları */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const targetHref = isAuthenticated
              ? `/purchase?plan=${plan.id}`
              : plan.href || `/register?plan=${plan.id}`;
            const isCurrent = Boolean(currentPlanId && currentPlanId === plan.id);
            const ctaLabel = isCurrent
              ? "Mevcut planın"
              : isAuthenticated
              ? plan.id === "free"
                ? "Panelime Git"
                : "Planımı Seç"
              : plan.ctaLabel;
            const href = isCurrent ? "#" : targetHref;
            return (
              <article
                key={plan.id}
                className={[
                  "flex h-full flex-col justify-between rounded-2xl border bg-slate-900/60 p-5 shadow-lg shadow-emerald-500/10",
                  plan.accentClasses,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-emerald-200">
                      <Icon />
                    </div>
                    {plan.badge && (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-50">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-emerald-200/80">{plan.quota}</p>
                  </div>

                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-semibold text-slate-50">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-xs text-slate-400">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300">{plan.description}</p>

                  <ul className="mt-3 space-y-1.5 text-xs text-slate-200">
                    {plan.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-1.5">
                        <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <Link
                    href={href}
                    aria-disabled={isCurrent}
                    data-analytics={`pricing_choose_plan_${plan.id}`}
                    className={[
                      "inline-flex w-full items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition",
                      isCurrent
                        ? "border border-emerald-400/60 bg-slate-900 text-emerald-200 cursor-default"
                        : plan.id === "free"
                        ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                        : "bg-slate-800 text-slate-50 hover:bg-slate-700",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {ctaLabel}
                  </Link>
                  {isCurrent ? (
                    <p className="mt-2 text-[11px] text-emerald-200">
                      Mevcut planın aktif. Daha yüksek limite geçmek için üst planları seçebilirsin.
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-400">
          Kararsızsan{" "}
          <span className="font-medium text-emerald-300">
            Free planla başlayıp
          </span>{" "}
          ilk 3 belgeni yükleyebilirsin. Daha sonra ihtiyacına göre Starter, Pro, Business veya
          Enterprise plana geçebilirsin.
        </p>

        <div className="flex justify-center">
          <CustomOfferForm />
        </div>
      </div>
    </section>
  );
}

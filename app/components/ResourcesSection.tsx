"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Code2, ShieldCheck, ArrowRight } from "lucide-react";

export default function ResourcesSection() {
  const resources = [
    {
      icon: <BookOpen className="h-5 w-5 text-emerald-400" />,
      title: "Rehber",
      subtitle: "Excel’de barkodlu stok takibi nasıl yapılır?",
      description:
        "Şablon, barkod okuyucu kurulumu ve BotExcel entegrasyonunu anlatan adım adım rehber.",
      href: "/guides/barcode-stock-tracking",
    },
    {
      icon: <Code2 className="h-5 w-5 text-sky-400" />,
      title: "API",
      subtitle: "BotExcel REST & CLI Dökümantasyonu",
      description:
        "Kimlik doğrulama, örnek istekler, dönüş formatları ve hata kodlarıyla tam API referansı.",
      href: "/docs/api",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-amber-400" />,
      title: "KVKK",
      subtitle: "Veri Güvenliği & Audit Katmanı",
      description:
        "Yerel yapay zekâ mimarisi, erişim kontrolleri, log yönetimi ve KVKK uyumluluğu için teknik döküman.",
      href: "/docs/security",
    },
  ];

  return (
    <section
      id="resources"
      className="w-full border-t border-slate-100 bg-white px-4 py-20 dark:border-slate-800 dark:bg-slate-950 md:px-8 lg:px-16"
    >
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-500">
            Kaynaklar
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 md:text-3xl">
            BotExcel’i ekibinize daha hızlı taşıyın.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {resources.map((resource) => (
            <div
              key={resource.href}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {resource.icon}
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                    {resource.title}
                  </h3>
                </div>
                <h4 className="text-lg font-semibold text-slate-900 transition group-hover:text-emerald-400 dark:text-slate-100">
                  {resource.subtitle}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {resource.description}
                </p>
              </div>

              <Link
                href={resource.href}
                className="mt-4 inline-flex items-center text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                Oku
                <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

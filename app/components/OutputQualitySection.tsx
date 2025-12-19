"use client";

import React from "react";
import { motion } from "framer-motion";
import { useI18n } from "../lib/i18n";

export function OutputQualitySection() {
  const { t } = useI18n();

  return (
    <motion.section
      id="output-quality"
      className="w-full bg-slate-950 px-4 py-16 text-slate-50 md:px-8 lg:px-16"
      initial={{ opacity: 0, filter: "blur(16px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.6, ease: "easeOut", delay: 0.4 }}
    >
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
            {t.outputQuality.sectionTag}
          </p>
          <h2 className="text-2xl font-semibold md:text-3xl">
            {t.outputQuality.sectionTitle}
          </h2>
          <p className="text-sm text-slate-300 md:text-base">
            {t.outputQuality.sectionDesc}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">
              {t.outputQuality.beforeLabel}
            </p>
            <ul className="space-y-1.5 text-sm text-slate-200">
              {t.outputQuality.beforeItems.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
              <li>
                •{" "}
                <code className="rounded bg-slate-800 px-1 py-0.5 text-xs">
                  {t.outputQuality.beforeFile}
                </code>
              </li>
            </ul>
          </div>

          <div className="space-y-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
              {t.outputQuality.afterLabel}
            </p>
            <ul className="space-y-1.5 text-sm text-emerald-50">
              {t.outputQuality.afterItems.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
              <li>
                •{" "}
                <code className="rounded bg-emerald-900 px-1 py-0.5 text-xs">
                  {t.outputQuality.afterFile}
                </code>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-300">
            {t.outputQuality.comparison}
            <span className="font-semibold text-emerald-300">
              {" "}
              {t.outputQuality.comparisonHighlight}
            </span>
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <a
              href="/samples/fatura_ozet_2025Q1.xlsx"
              download
              className="inline-flex items-center justify-center rounded-full border border-emerald-400/70 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-100 transition hover:bg-emerald-500/20"
              aria-label="Örnek Excel indir"
              data-analytics="output_quality_download_sample"
            >
              {t.outputQuality.downloadCta}
            </a>

            <a
              href="/upload"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
              aria-label="Kendi belgenle dene"
              data-analytics="output_quality_try_own_doc"
            >
              Kendi belgenle dene
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

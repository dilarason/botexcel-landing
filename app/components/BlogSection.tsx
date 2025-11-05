"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BlogSection() {
  const posts = [
    {
      title: "Yapay zekâ ile Excel otomasyonu: Finans ekipleri için yeni dönem",
      summary:
        "Klasik makrolardan üretici yapay zekâ modellerine geçişte finans ekiplerinin dikkat etmesi gereken noktalar.",
      href: "/blog/yapay-zeka-ile-excel-otomasyonu",
    },
    {
      title: "PDF’ten tabloya dönüşümde dikkat edilmesi gereken 7 nokta",
      summary:
        "Eksik alanlar, bozuk tarih formatları ve para birimleriyle baş etmenin pratik yollarını derledik.",
      href: "/blog/pdf-ten-tabloya-donusumde-7-nokta",
    },
    {
      title: "KOBİ’ler için veri yönetimi rehberi",
      summary:
        "Manavdan lojistik firmasına kadar, günlük veri disiplinini kurmak için uygulanabilir öneriler.",
      href: "/blog/kobiler-icin-veri-yonetimi-rehberi",
    },
  ];

  return (
    <section
      id="blog"
      className="w-full bg-slate-50 px-4 py-20 dark:bg-slate-950 md:px-8 lg:px-16"
    >
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-500">
            Bilgi Merkezi & Blog
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 md:text-3xl">
            Yapay zekâ ile Excel otomasyonunun mutfağından notlar.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 md:text-base">
            PDF’ten tabloya dönüşüm ipuçlarından KOBİ’ler için pratik veri yönetimi önerilerine kadar birçok konuda
            düzenli içerik üretiyoruz.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.href}
              className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900 transition group-hover:text-emerald-400 dark:text-slate-100">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{post.summary}</p>
              </div>
              <Link
                href={post.href}
                className="mt-4 inline-flex items-center text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                Yazıyı oku
                <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

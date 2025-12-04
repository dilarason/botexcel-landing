"use client";

const faqs = [
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

interface FAQSectionProps {
  title?: string;
}

export function FAQSection({ title = "Kararsız kalanlar için son netleştirmeler." }: FAQSectionProps) {
  return (
    <section
      id="faq"
      aria-label="Sık sorulan sorular"
      className="mx-auto max-w-5xl px-4 sm:px-6 pb-12 sm:pb-16 text-slate-50"
    >
      <header className="mb-6">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-300 mb-2">
          Sık sorulan sorular
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">{title}</h2>
      </header>

      <div className="space-y-4 text-sm text-slate-200">
        {faqs.map((item) => (
          <div
            key={item.question}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
          >
            <h3 className="font-semibold mb-1 text-slate-50">{item.question}</h3>
            <p className="text-sm text-slate-300">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

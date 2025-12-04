"use client";

export function TrustSection() {
  return (
    <section
      id="trust"
      aria-label="Güvenlik ve KVKK bilgileri"
      className="mx-auto max-w-5xl px-4 sm:px-6 pb-12 sm:pb-16 text-slate-50"
    >
      <header className="mb-6">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-sky-300 mb-2">
          Güven &amp; KVKK
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">
          Veriniz size aittir. Biz sadece düzenleriz.
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl">
          BotExcel, finansal ve operasyonel verilerin ne kadar kritik olduğunun farkında. Bu yüzden
          ürünü "önce güvenlik" prensibiyle tasarladık. Verileriniz yalnızca işlenmek üzere
          kullanılır, mülkiyeti daima sizde kalır.
        </p>
      </header>

      <div className="grid md:grid-cols-[3fr,2fr] gap-4 items-start">
        <div className="space-y-3 text-sm text-slate-300">
          <p>
            Tüm belgeleriniz aktarım sırasında ve kullanım halinde güçlü algoritmalarla şifrelenir.
            KVKK ve GDPR standartlarıyla uyumlu veri işleme süreçleri sayesinde, hem yasal
            sorumluluklarınızı yerine getirir hem de iç denetim ekiplerinizi rahatlatırsınız.
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5">
            <li>• Veriler AES-256 ile şifrelenir.</li>
            <li>• Erişim rolleri RBAC (Role Based Access Control) ile sınırlandırılır.</li>
            <li>• Tüm işlemler audit log’lara JSON formatında kaydedilir.</li>
            <li>• Veri saklama bölgeleri Türkiye ve EU datacenter lokasyonlarıyla sınırlıdır.</li>
          </ul>
          <a
            href="/security"
            className="inline-flex items-center text-xs text-emerald-300 mt-2 hover:text-emerald-200"
          >
            Güvenlik politikamızı inceleyin →
          </a>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-[11px] text-slate-200 font-mono overflow-x-auto">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
            Audit log örneği
          </div>
          <pre className="whitespace-pre text-[11px] leading-snug">
{`{
  "document_id": "FATURA-2025-03-0012",
  "row": 42,
  "column": "KDV_TUTAR",
  "old_value": "0",
  "new_value": "1.280,50",
  "model_version": "botexcel-gemma-1.3",
  "updated_by": "ai_engine",
  "timestamp": "2025-03-21T10:14:32Z"
}`}
          </pre>
        </div>
      </div>
    </section>
  );
}

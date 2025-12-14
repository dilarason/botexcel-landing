import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BotExcel REST & CLI Dokümantasyonu | BotExcel",
  description:
    "BotExcel’in REST API ve komut satırı arayüzü için dokümantasyon iskeleti. Kimlik doğrulama, örnek istekler ve dönüş formatları daha sonra detaylandırılacaktır.",
};

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-12 md:py-16">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300/80">
            API Dokümantasyonu
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            BotExcel REST &amp; CLI Dokümantasyonu
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 md:text-base">
            Bu sayfa, kimlik doğrulama, örnek istekler, dönüş formatları ve hata kodları için tam
            API referansının yer tutucusudur. Uygulama geliştirme sürecinizde kullanılacak detaylar
            ilerleyen sürümlerde burada yayınlanacaktır.
          </p>
        </header>

        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
          <p>
            Buraya, örnek `curl` komutları, istek/yanıt şemaları ve CLI komutları için hızlı
            başlangıç rehberi eklenecek. Şimdilik bu alan, entegrasyon dokümantasyonu için bir
            taslak olarak bırakıldı.
          </p>
          <p>
            API’yi canlı görmek için önce BotExcel hesabınıza giriş yapabilir, ardından dosya
            yükleme ekranından gerçek dönüşümleri deneyebilirsiniz.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs">
          <Link
            href="/upload"
            className="inline-flex items-center rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Dosya yükle
          </Link>
          <Link
            href="/"
            className="inline-flex items-center text-slate-400 underline hover:text-slate-200"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </section>
    </main>
  );
}


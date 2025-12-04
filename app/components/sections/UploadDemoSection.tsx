"use client";

import DemoUploaderWidget from "../DemoUploader";

export function UploadDemoSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-12 sm:pb-16 text-slate-50">
      <header className="mb-6 text-center sm:text-left">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-300 mb-2">
          Canlı demo
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">Kendi belgenizle deneyin.</h2>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto sm:mx-0">
          Ürüne karar vermeden önce ne göreceğinizi bilmek istersiniz. BotExcel, ilk temasınızı
          olabildiğince zahmetsiz hale getirir: Belgenizi seçin ya da hazır demo örneklerinden birini
          kullanın, birkaç saniye içinde örnek Excel çıktısını görün. İlk demo gerçek belgeniz
          üzerinden işlenir, limit dolduğunda plan yükseltme çağrısı görürsünüz.
        </p>
      </header>

      <DemoUploaderWidget />
    </section>
  );
}

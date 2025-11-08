# BotExcel Landing

Next.js 16 (App Router) landing sayfası. Ana domain (`botexcel.pro / www.botexcel.pro`) bu servis tarafından sunulur, API çağrıları ise `api.botexcel.pro` alt alanındaki FastAPI proxy’sine yönlendirilir.

## 🚧 Geliştirme

```bash
npm install
npm run dev
```

- Proje “app/” dizini altında tek bir ana bileşenden ayrıştırıldı (`BotExcelScrollDemo`).
- Plan verileri `app/lib/plans.ts` dosyasında tutulur; landing ve satın alma sayfası bu modülü paylaşır.
- Demo uploader ve scroll animasyonları `app/BotExcelScrollDemo.tsx` içinde çalışır; pricing bölümü `app/components/PricingSection.tsx` olarak ayrıldı.

## 🌱 Ortam Değişkenleri

| Değişken | Açıklama |
| --- | --- |
| `NEXT_PUBLIC_API_BASE` | Frontend’in çağıracağı FastAPI / proxy adresi. Örn. `https://api.botexcel.pro`. |

`NEXT_PUBLIC_` ile başlayan değişkenler build sırasında gömüldüğü için Render’da Environment sekmesinde ayarlandıktan sonra yeniden deploy edilmelidir.

## 🚀 Render Deploy

1. **Build Command**: `npm install && npm run build`
2. **Start Command**: `npm run start`
3. Servis türü: Node 20, Starter plan (uykuya geçmeyen sürekli ayakta instance).
4. Deploy tetikleyici: *Auto Deploy → On Commit* (main dalına her push otomatik olarak build edilir).
5. Custom domainler: `botexcel.pro` ve `www.botexcel.pro` bu servise, `api.botexcel.pro` ise FastAPI proxy’sine yönlendirilir. DNS tarafında kök domain için Render’ın verdiği A kayıtları, `www` için CNAME kullanılır.

Yeni commit sonrası Render’daki “Deploys” sekmesinde build durumunu takip edebilir veya gerektiğinde “Deploy Latest Commit” ile manuel dağıtım yapabilirsin.

## 🧪 Lint

```bash
npm run lint
```

ESLint `next/image` kullanımı ve App Router kurallarını enforce eder. CI/CD’de build öncesi bu komut çalıştırılırsa production ile aynı sonuç elde edilir.

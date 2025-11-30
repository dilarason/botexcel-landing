# Vercel Environment Variables Rehberi

Bu dosya Vercel Dashboard'da ayarlanması gereken environment variables için referans amaçlıdır.

## Backend API URL (Production)

```
NEXT_PUBLIC_API_URL=https://api.botexcel.pro
```

## Nasıl Eklenir?

1. Vercel Dashboard → Project Settings → Environment Variables
2. Key-Value çiftlerini ekle
3. Production, Preview, Development ortamlarını seç
4. Save

## Notlar

- `.env.local` dosyanızdaki diğer değişkenler varsa bunları da Vercel Dashboard'da manuel olarak eklemelisiniz
- `NEXT_PUBLIC_` prefix'i olan değişkenler client-side'da kullanılabilir
- Prefix olmayan değişkenler sadece server-side'da kullanılabilir (API routes, SSR)

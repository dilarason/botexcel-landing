# C Modeli İş Akışı (Antigravity → Codex → Antigravity)

## A) Başlatma (Her görevde zorunlu)
1) Her ajan önce şunu okur:
   - `_docs/cto-manifesto.md`
   - `_docs/ops/AGENT_RULES.md`
2) Görev başlığı belirlenir (tek cümle).
3) Antigravity tasarım paketini üretir:
   - Riskler
   - Edge-case
   - Acceptance Criteria
   - Uygulama planı
4) Antigravity bunu RUNLOG’a **Tasarım Kaydı** olarak append eder.

## B) Uygulama (Codex)
1) Codex sadece tasarım paketindeki scope’u uygular.
2) Kod hijyen:
   - node_modules patch yok
   - hack yok
3) Zorunlu doğrulama:
   - `pnpm lint`
   - `pnpm build`
4) Codex RUNLOG’a **Uygulama Kaydı** append eder.

## C) Kabul Kapısı (Antigravity)
1) Antigravity Codex’in kanıtlarını inceler:
   - Değişen dosyalar
   - lint/build çıktıları
   - Risk ve regresyon olasılığı
2) Karar:
   - ACCEPTED veya REJECTED
3) Antigravity RUNLOG’a **Denetim Kaydı** append eder.

## D) Son Kontrol (ChatGPT)
- RUNLOG üzerinden:
  - Scope ihlali var mı?
  - Riskler kapatılmış mı?
  - Bir sonraki görev için hazır mıyız?

> Not: Kabul kaydı olmadan sonraki göreve geçilmez.

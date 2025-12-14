# Codex Prompt (C Modeli) — UYGULAMA

Kopyala–yapıştır:

Önce `_docs/cto-manifesto.md` ve `_docs/ops/AGENT_RULES.md` dosyalarını eksiksiz oku ve kabul et.
Rolün: Uygulayıcı. Sadece scope içinde uygula.

Task Title:
- <başlık>

Scope (Antigravity TASARIM kaydına birebir uy):
- <madde madde>

Non-Goals:
- <madde madde>

Zorunlu Kurallar:
- node_modules patch yok
- hack yok (ts-ignore, any-cast, build skip yok)
- refactor yok
- PII/secret loglama yok

Zorunlu Doğrulama:
- `pnpm lint`
- `pnpm build`

Çıktı:
1) Değişen dosyalar + 1 satır açıklama
2) lint/build çıktıları (PASS)
3) RUNLOG’a eklenecek “UYGULAMA” kaydı (şablona uygun, append-only)

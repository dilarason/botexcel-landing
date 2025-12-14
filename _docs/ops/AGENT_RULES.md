# BotExcel Agent Rules (C-Model Workflow)
> Üst doküman: `_docs/cto-manifesto.md` her zaman 1 numaralı otoritedir.
> Bu dosya, “C modeli” çalışma otomasyonunu tanımlar: Antigravity tasarlar → Codex uygular → Antigravity kabul eder → RUNLOG ile iz bırakılır.

## 0) Altın Kural
- **Kayıt yoksa iş yok.** Her adımın sonunda `_docs/AGENT_RUNLOG.md` içine append yapılmadan görev tamamlanmış sayılmaz.

## 1) Rol Ayrımı (C Modeli)
### Antigravity (Tasarım + Denetim)
- Kod yazmaz (istisnalar bölümüne bak).
- Şunları üretir:
  - Acceptance Criteria (kabul kriterleri)
  - Risk analizi (KVKK/PII, güvenlik, tasarım regresyon)
  - Edge-case listesi
  - Uygulama planı (minimal scope)
- Codex çıktısından sonra **ACCEPT/REJECT** kararı verir ve RUNLOG’a denetim kaydı girer.

### Codex (Uygulama)
- Sadece scope içinde uygular.
- `node_modules` patch yok.
- Hack yok: build skip, ts-ignore, any-cast, “geçsin diye” çözüm yok.
- Zorunlu doğrulama: `pnpm lint` ve `pnpm build`.
- RUNLOG’a uygulama kaydı girer.

## 2) İstisnalar (Antigravity’nin kod yazabileceği durumlar)
Sadece şu koşullarda “referans kod” yazabilir:
- Tek dosya, izole yardımcı fonksiyon (PII mask/hashing, rate limit key vb.)
- 50 satır altı ve sadece örnek amaçlı
- Yine de repo’ya uygulamayı Codex yapar.

## 3) Scope Kilidi
Her görev şu üç blokla tanımlanır:
- Task Scope (ne yapılacak)
- Non-Goals (ne yapılmayacak)
- Acceptance Criteria (bitti sayılması için şartlar)

Bu üçü yoksa görev geçersiz.

## 4) RUNLOG Zorunluluğu
- Antigravity: Tasarım Kaydı + Denetim Kaydı
- Codex: Uygulama Kaydı

Formatlar `_docs/ops/templates/RUNLOG_TEMPLATES.md` içindedir.

## 5) Dosya Disiplini
- Yeni dokümanlar sadece `_docs/ops/` altına.
- Üretim kararlarının özeti her zaman `_docs/AGENT_RUNLOG.md` içinde.


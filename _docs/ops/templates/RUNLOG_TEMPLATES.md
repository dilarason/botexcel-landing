# RUNLOG Şablonları (Append Only)

## 1) Antigravity — Tasarım Kaydı
## YYYY-MM-DDTHH:MM+03:00
### RUN • <Başlık> • TASARIM

- Owner: ChatGPT (Antigravity)
- Scope: <kısa>
- Non-Goals: <kısa>
- Acceptance Criteria:
  - [ ] ...
  - [ ] ...
- Riskler (KVKK/PII/Güvenlik/Tasarım):
  - ...
- Edge-cases:
  - ...
- Plan:
  1) ...
  2) ...

---

## 2) Codex — Uygulama Kaydı
## YYYY-MM-DDTHH:MM+03:00
### RUN • <Başlık> • UYGULAMA

- Owner: ChatGPT (Codex)
- Scope: <kısa>
- Changes:
  - path/to/file.ext — <1 satır>
- Tests:
  - pnpm lint: PASS
  - pnpm build: PASS
- Risk: <düşük/orta + 1 satır>
- Rollback:
  - <değişen dosyaları geri al / komut>

---

## 3) Antigravity — Denetim (Kabul Kapısı)
## YYYY-MM-DDTHH:MM+03:00
### RUN • <Başlık> • DENETİM

- Owner: ChatGPT (Antigravity)
- Verdict: ACCEPTED | REJECTED
- Kontroller:
  - node_modules patch yok: OK/FAIL
  - hack yok (ts-ignore/any/build skip yok): OK/FAIL
  - lint/build kanıtlı: OK/FAIL
  - KVKK/PII etkisi: OK/FAIL
  - tasarım regresyon riski: düşük/orta/yüksek
- Gerekçe (1–3 madde):
  - ...
- Risk:
  - ...
- Rollback:
  - ...


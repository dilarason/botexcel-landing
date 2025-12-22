# Telemetry + A/B Micro-Copy Specification

## 1) Amaç

Landing page conversion'ı ölçülebilir şekilde artırmak.

**Gelir etkisi:**

- OutputQuality section download CTA micro-copy A/B testi ile CTR %15+ artış hedefi
- Upload intent → conversion funnel optimizasyonu
- 7 gün sonunda data-driven copy kararı

## 2) Kapsam

| Dosya | Aksiyon |
|-------|---------|
| `app/lib/telemetry.ts` | NEW |
| `app/api/telemetry/route.ts` | NEW |
| `app/components/OutputQualitySection.tsx` | MOD |
| `app/components/ClaritySection.tsx` | MOD |
| `app/lib/i18n.tsx` | MOD |
| `_docs/telemetry-measurement-plan.md` | NEW |

## 3) Acceptance Criteria

- [ ] `NEXT_PUBLIC_TELEMETRY` kapalıyken `track()` no-op, hiç network çağrısı yok
- [ ] Allowlist dışı event → 400 + `{"error":"Invalid event name"}`
- [ ] Rate limit (100 req/min/IP) aşıldığında 429 döner
- [ ] A/B assignment localStorage'da persist, 50/50 random
- [ ] View tracking IntersectionObserver ile once tetiklenir (threshold 0.35)
- [ ] CTA hierarchy: Primary (upload, solid emerald), Secondary (download, ghost)
- [ ] i18n: TR + EN için `downloadCtaB` ve `tryOwnDoc` mevcut
- [ ] `pnpm lint` + `pnpm build` PASS

## 4) Edge Cases / Riskler

1. **localStorage blocked (private mode):** `getABVariant` fallback "A" döner
2. **SSR hydration mismatch:** `useMemo` ile client-only read, SSR'da default "A"
3. **API timeout/failure:** Silently fail, UX asla kırılmaz
4. **Race condition (rapid clicks):** `keepalive: true` ile beacon-style POST
5. **PII risk:** Payload'da email/isim YOK, sadece anon_id + session_id
6. **Hot reload memory leak:** globalThis bucket pattern ile safe

## 5) Ölçüm Planı

### Events → Funnel

```
view_output_quality (section görünür)
    ↓
output_quality_download_sample (download click)
    ↓
output_quality_try_own_doc | clarity_cta_try_own_doc (upload intent)
    ↓
visit_upload (sayfa açıldı)
```

### Primary Metric

`output_quality_download_sample` / `view_output_quality` (unique anon_id, A/B kırılımı)

### Secondary Metrics

- Try intent rate: try clicks / views
- Upload completion: visit_upload / try intent
- Source comparison: clarity vs output-quality try ratio

### Karar Kriteri (7 gün sonunda)

- Min sample: 200+ view / variant
- Kazanan: %15+ uplift veya p < 0.05

## 6) Rollback

### Immediate (flag disable)

```bash
unset NEXT_PUBLIC_TELEMETRY
unset TELEMETRY_LOG
```

### Full Revert

```bash
git revert <commit-hash>
```

---

**NOT:** Bu doküman Codex için bağlayıcı spesifikasyondur.

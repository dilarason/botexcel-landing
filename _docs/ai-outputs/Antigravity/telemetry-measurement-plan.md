# BotExcel Landing Telemetry — 7 Gün Ölçüm Planı

Bu doküman, landing sayfasındaki A/B micro-copy ve CTA hiyerarşisini 7 gün içinde ölçmek için pratik bir plan sunar.

## Rollback / Feature Flags
- Client telemetry: `NEXT_PUBLIC_TELEMETRY=1` (kapalıysa `track()` no-op, network çağrısı yok)
- Server logging: `TELEMETRY_LOG=1`
- Opsiyonel NDJSON dosyası: `TELEMETRY_FILE=/tmp/botexcel-telemetry.ndjson`

Rollback: `NEXT_PUBLIC_TELEMETRY` ve/veya `TELEMETRY_LOG` değerlerini kapat (0/empty). Kod değişmeden devre dışı kalır.

## Event Allowlist
Endpoint allowlist’i: `app/api/telemetry/route.ts`

Beklenen event’ler:
- `view_output_quality`
- `output_quality_download_sample`
- `output_quality_try_own_doc`
- `clarity_cta_try_own_doc`
- `visit_upload`

## Payload (NDJSON satırı)
Her satır tek JSON objesi:
```json
{
  "event": "output_quality_download_sample",
  "variant": "A",
  "path": "/",
  "ref": "",
  "ts": "2025-12-19T00:00:00.000Z",
  "anon_id": "anon_...",
  "session_id": "sess_...",
  "meta": { "source": "output-quality", "href": "/samples/fatura_ozet_2025Q1.xlsx" },
  "ip": "203.0.113.10"
}
```

PII (email/isim/telefon) göndermeyin. `meta` sadece kaynak + UX bağlamı içermeli.

## Funnel (7 gün)
**Amaç:** Download CTA’sını (A/B) ölçmek, kazanan kopy’yi seçmek ve ana CTA’yı upload’a yönlendiren “primary CTA” olarak doğrulamak.

1) `view_output_quality` (view)
2) `output_quality_download_sample` (click)
3) `output_quality_try_own_doc` ve `clarity_cta_try_own_doc` (upload intent)
4) `visit_upload` (upload sayfası açıldı)

Önerilen metrikler:
- View → Download CTR (A/B kırılımı)
- View → TryOwnDoc CTR
- Try → Upload visit oranı (intent → page visit)

## Analiz Komutları
Varsayım: log dosyası `telemetry.log` veya `TELEMETRY_FILE` ile set ettiğin yol.

**Try CTA kırılımı (OutputQuality vs Clarity)**
```bash
grep '"event":"output_quality_try_own_doc"\\|"event":"clarity_cta_try_own_doc"' telemetry.log \
  | jq -r '.event' | sort | uniq -c
```

**Event sayıları**
```bash
jq -r '.event' telemetry.log | sort | uniq -c | sort -nr
```

**A/B kırılımı: download tıklama**
```bash
jq -r 'select(.event=="output_quality_download_sample") | .variant' telemetry.log | sort | uniq -c
```

**A/B kırılımı: view**
```bash
jq -r 'select(.event=="view_output_quality") | .variant' telemetry.log | sort | uniq -c
```

**CTR (yaklaşık): view → download**
```bash
views=$(jq -r 'select(.event=="view_output_quality") | .anon_id' telemetry.log | sort -u | wc -l | tr -d " ")
clicks=$(jq -r 'select(.event=="output_quality_download_sample") | .anon_id' telemetry.log | sort -u | wc -l | tr -d " ")
echo "views=$views clicks=$clicks ctr=$(awk \"BEGIN{if($views==0)print 0; else print $clicks/$views}\")"
```

**CTR (A/B): view → download (unique anon_id)**
```bash
for v in A B; do
  views=$(jq -r "select(.event==\"view_output_quality\" and .variant==\"$v\") | .anon_id" telemetry.log | sort -u | wc -l | tr -d " ")
  clicks=$(jq -r "select(.event==\"output_quality_download_sample\" and .variant==\"$v\") | .anon_id" telemetry.log | sort -u | wc -l | tr -d " ")
  echo "variant=$v views=$views clicks=$clicks ctr=$(awk \"BEGIN{if($views==0)print 0; else print $clicks/$views}\")"
done
```

**Try intent → Upload visit**
```bash
tries=$(jq -r 'select(.event=="output_quality_try_own_doc" or .event=="clarity_cta_try_own_doc") | .anon_id' telemetry.log | sort -u | wc -l | tr -d " ")
visits=$(jq -r 'select(.event=="visit_upload") | .anon_id' telemetry.log | sort -u | wc -l | tr -d " ")
echo "tries=$tries visits=$visits ratio=$(awk \"BEGIN{if($tries==0)print 0; else print $visits/$tries}\")"
```

## Kazanan Kopy Kararı
7 gün sonunda:
- Minimum sample: her varyant için en az 200 view (tercihen daha fazla)
- Birincil metrik: `view_output_quality` → `output_quality_download_sample` CTR (A/B)
- İkincil metrik: `output_quality_try_own_doc` CTR ve `visit_upload` oranı

Kazananı seçtikten sonra:
- `OutputQualitySection` içinde `downloadCta` metnini kazanan kopy’ye sabitle (A/B’yi kaldır) veya `getABVariant()` key’ini kapatacak şekilde feature flag ekle.

## Doğrulama (Local dev + curl)

**1) Dev server**
```bash
NEXT_PUBLIC_TELEMETRY=1 TELEMETRY_LOG=1 TELEMETRY_FILE=./telemetry.log pnpm dev
```

**2) Valid payload (PASS)**
```bash
curl -i -X POST http://127.0.0.1:3000/api/telemetry \
  -H 'content-type: application/json' \
  -d '{"event":"output_quality_download_sample","variant":"A","path":"/","ref":"","ts":"2025-12-19T00:00:00.000Z","anon_id":"test","session_id":"test","meta":{"source":"manual"}}'
```
Beklenen:
- Response: `{"ok":true}`
- Server console’da NDJSON satırı
- `TELEMETRY_FILE` set ise `telemetry.log` içine satır yazılmış olmalı

**3) Invalid event reject (PASS)**
```bash
curl -i -X POST http://127.0.0.1:3000/api/telemetry \
  -H 'content-type: application/json' \
  -d '{"event":"invalid_event","variant":"A","path":"/","ref":"","ts":"2025-12-19T00:00:00.000Z","anon_id":"test","session_id":"test","meta":{}}'
```
Beklenen:
- Status `400`
- Response: `{"error":"Invalid event name"}`

## Doğrulama & Kanıt (PASS/FAIL)

**1) Lint / Build**
```bash
pnpm lint; echo "LINT_EXIT=$?"
pnpm run build
```
PASS kriteri: `LINT_EXIT=0` ve build hatasız.

**2) Endpoint curl testi**
- Yukarıdaki “Local dev + curl” adımlarını PASS et.

## Rollback (tek commit revert)
```bash
git revert HEAD
```

# G4.2: Pro Plan, Telemetry & Admin Görünürlüğü

**Görev**: Pro plan, telemetry ve admin görünürlüğü için en minimal ama ölçeklenebilir çerçeveyi tanımla.  
**Amaç**: Ürünü izlenebilir ve yönetilebilir kıl, scope creep olmadan.

**Mod**: Design + Risk  
**Kod Yazılmayacak**: Bu bir tasarım ve planlama dokümanıdır.

---

## 1. Amaç & Kapsam

### 1.1 Amaç

**Telemetry (İzleme)**:
- Kullanıcı davranışlarını anla (hangi özellikler kullanılıyor?)
- Sistem sağlığını izle (hata oranları, performans)
- Ürün kararlarını veriyle destekle

**Pro Plan**:
- Free vs Pro kullanıcıları ayırt et
- Pro özelliklere erişim kontrolü
- Kullanım limitlerini yönet (kota)

**Admin Görünümü**:
- Sistem durumunu görüntüle (toplam kullanıcı, dönüşüm sayısı, hata oranı)
- Bireysel kullanıcı detaylarına eriş (debug için)
- Anomalileri tespit et (abuse, bug)

### 1.2 Kapsam

**VAR (In Scope)**:
- Event-based telemetry sistemi (backend)
- Pro plan feature flag mekanizması
- Admin API endpoint (sadece metadata)
- Basic admin UI (read-only, liste + detay)

**YOK (Out of Scope)**:
- Grafik/dashboard (başlangıçta; raw data yeter)
- Real-time monitoring (batch processing yeterli)
- User segmentation/cohort analizi
- A/B testing framework
- Bildirim sistemi (alert, Slack botu vb.)

---

## 2. Telemetry Olayları (Event Listesi)

### 2.1 Kullanıcı Olayları

**Kimlik Doğrulama**:
- `user_registered` → Yeni kullanıcı kaydı
  - Metadata: `plan` (free/pro), `signup_source` (organic/referral)
- `user_login` → Kullanıcı giriş yaptı
  - Metadata: `auth_method` (email/google)
- `user_upgraded` → Free → Pro geçiş
  - Metadata: `plan_id`, `payment_method`

**Dosya İşlemleri**:
- `file_uploaded` → Excel dosyası yüklendi
  - Metadata: `file_size`, `file_type`, `row_count` (PII yok)
- `convert_started` → Dönüştürme başladı
  - Metadata: `file_id`, `target_format`
- `convert_completed` → Dönüştürme tamamlandı
  - Metadata: `duration_ms`, `success`, `error_code` (varsa)
- `convert_failed` → Dönüştürme başarısız
  - Metadata: `error_code`, `error_category` (quota/validation/server)

**Agent İşlemleri**:
- `context_created` → Yeni agent context oluşturuldu (G3)
  - Metadata: `file_id`, `context_id`
- `context_switched` → Kullanıcı farklı dosyaya geçti
  - Metadata: `old_context_id`, `new_context_id`
- `agent_message_sent` → Kullanıcı agent'a mesaj gönderdi
  - Metadata: `context_id`, `message_length`, `source_count` (G4.1)
- `agent_response_received` → Agent yanıt verdi
  - Metadata: `response_length`, `latency_ms`, `sources_shown`

### 2.2 Sistem Olayları

**Hata & Performans**:
- `api_error` → API hatası
  - Metadata: `endpoint`, `status_code`, `error_code`
- `rate_limit_hit` → Kullanıcı rate limit'e takıldı
  - Metadata: `endpoint`, `limit_type` (hourly/daily)
- `quota_exceeded` → Kota aşıldı
  - Metadata: `resource_type` (file_size/convert_count/message_count)

**Güvenlik**:
- `unauthorized_access_attempt` → Yetkisiz erişim denemesi
  - Metadata: `resource_type` (file/context), `attempted_resource_id`
- `suspicious_activity` → Şüpheli aktivite (örn: çok hızlı istek)
  - Metadata: `activity_type`, `frequency`

### 2.3 Event Schema (Standart)

Tüm eventler aynı yapıda:

```json
{
  "event_type": "agent_message_sent",
  "timestamp": "2025-12-15T03:00:00Z",
  "user_id": "uuid-hash",
  "session_id": "session-uuid",
  "metadata": {
    "context_id": "ctx_abc123",
    "message_length": 45
  }
}
```

**Zorunlu Alanlar**:
- `event_type`, `timestamp`, `user_id`

**Opsiyonel**:
- `session_id`, `metadata` (event'e göre değişir)

---

## 3. Pro Plan Davranışları

### 3.1 Plan Seviyeleri

**Free Plan**:
- Maksimum 10 dosya yükleme/ay
- Maksimum 50 agent mesajı/ay
- Dosya boyutu limiti: 5 MB
- Dönüşüm geçmişi: 7 gün

**Pro Plan**:
- Sınırsız dosya yükleme
- Sınırsız agent mesajı
- Dosya boyutu limiti: 50 MB
- Dönüşüm geçmişi: 90 gün
- Öncelikli destek (badge'de gösterilir)

### 3.2 Feature Flag Mekanizması

**Backend Kontrol**:
```python
def check_feature_access(user, feature_name):
    if user.plan == "pro":
        return True
    
    if feature_name == "large_file_upload":
        return False  # Free: max 5MB
    
    if feature_name == "unlimited_messages":
        return user.usage.message_count < 50
    
    return False
```

**Kontrol Noktaları**:
- Dosya yükleme endpoint'i → boyut limiti kontrol
- Agent mesaj endpoint'i → mesaj sayısı kontrol
- Context oluşturma → dosya sayısı kontrol

**UI Göstergesi**:
- Free kullanıcı Pro özelliğe tıklarsa:
  - Modal: "Bu özellik Pro Plan için. [Yükselt]"
  - Badge: "PRO" rozeti gösterilir

### 3.3 Kota Takibi

**Kullanım Tablosu** (database):
```
user_usage:
  - user_id (FK)
  - period (month: "2025-12")
  - file_upload_count
  - message_count
  - total_file_size_mb
  - last_reset_at
```

**Reset Periyodu**: Her ayın 1'i (UTC 00:00)

**Aşım Davranışı**:
- Free kullanıcı limite ulaştığında: `quota_exceeded` event + 403 yanıt
- UI: "Bu ay limitinizi aştınız. Pro'ya geçin veya gelecek ay bekleyin."

---

## 4. Admin Görünümü

### 4.1 Neler Görülür (Metadata)

**Dashboard (Özet)**:
- Toplam kullanıcı sayısı (Free / Pro ayrımı)
- Toplam dosya yükleme (bugün / bu hafta / bu ay)
- Toplam dönüşüm sayısı (başarılı / başarısız)
- Toplam agent mesajı sayısı
- Ortalama yanıt süresi (agent latency)
- En sık hata kodları (top 5)

**Kullanıcı Listesi**:
- `user_id` (hash), `email` (ilk 3 karakter + `***`), `plan`, `created_at`, `last_login`
- Filtreleme: plan (free/pro), kayıt tarihi, son aktivite

**Kullanıcı Detayı** (tek kullanıcı için):
- Kullanım istatistikleri: dosya sayısı, mesaj sayısı, kota durumu
- Son 10 event (sadece event_type + timestamp, metadata yok)
- Hata sayısı (son 7 gün)
- **Dosya isimleri**: Gösterilir (PII değil, kullanıcının yüklediği dosya isimleri)
- **Mesaj içeriği**: GÖSTERİLMEZ (KVKK)

### 4.2 Neler Görülmez (PII Koruması)

**Kesinlikle Görülmez**:
- Agent mesaj içeriği (kullanıcı soruları, AI yanıtları)
- Excel hücre değerleri
- Kullanıcı tam e-posta adresi (maskelenir: `ah***@mail.com`)
- IP adresleri (hash gösterilir)
- Dosya içerikleri

**Sadece Hash/Metadata**:
- `user_id`: UUID (tersine çevrilemez)
- `file_id`: UUID
- `context_id`: UUID
- Event metadata: sadece sayısal/kategorik (ör: `message_length`, `error_code`)

### 4.3 Admin API Endpoint

**Tek Endpoint Yeterli** (başlangıçta):

`GET /api/admin/stats`

**Authentication**: Admin-only JWT token (role: admin)

**Response**:
```json
{
  "overview": {
    "total_users": 1234,
    "free_users": 1100,
    "pro_users": 134,
    "total_files_uploaded_today": 56,
    "total_conversions_today": 120,
    "total_agent_messages_today": 340,
    "avg_agent_latency_ms": 1850,
    "error_rate_today": 0.02
  },
  "top_errors": [
    {"code": "QUOTA_EXCEEDED", "count": 45},
    {"code": "INVALID_FILE", "count": 12}
  ]
}
```

**Kullanıcı Listesi** (ayrı endpoint, opsiyonel):
`GET /api/admin/users?plan=pro&limit=50`

---

## 5. KVKK / PII Sınırları

### 5.1 Telemetry'de OLABİLİR

**Metadata**:
- `user_id` (hash/UUID, tersine çevrilemez)
- `file_id`, `context_id`
- `file_size`, `row_count`, `file_type`
- Zaman damgaları (`timestamp`, `duration_ms`)
- Hata kodları (`error_code`)
- İstatistiksel değerler (`message_length`, `response_length`)

### 5.2 Telemetry'de OLAMAZ

**PII**:
- E-posta adresleri (admin UI'da maskelenir, telemetry'de yok)
- Kullanıcı adı/soyad
- IP adresleri (hash hariç)
- Telefon numaraları
- Dosya içerikleri (hücre değerleri, sütun başlıkları)
- Mesaj içerikleri (kullanıcı soruları, agent yanıtları)

**Loglama Kuralı**:
- Telemetry eventleri 90 gün saklanır (KVKK uyumlu)
- Admin görünümü sadece aggregated/hash veriler gösterir
- Kullanıcı hesap silerse: tüm eventleri hard delete (GDPR "right to be forgotten")

### 5.3 Admin Erişim Kuralları

**Kimler Admin Olabilir?**:
- Sadece sistem sahipleri (founder, CTO)
- Admin rolü database'de açıkça tanımlı (`users.role = 'admin'`)

**Audit Trail**:
- Her admin API çağrısı loglanır:
  - `admin_user_id`, `endpoint`, `accessed_user_id`, `timestamp`
- Audit log silinemez (compliance)

**Rate Limit**:
- Admin API: 100 req/hour (abuse önleme)

---

## 6. Acceptance Criteria (Kabul Kriterleri)

1. **Tüm Önemli Olaylar Track Ediliyor**  
   ✅ PASS: Bölüm 2.1'deki tüm eventler (`user_registered`, `file_uploaded`, `agent_message_sent` vb.) tetiklenince database'e yazılıyor  
   ❌ FAIL: Herhangi bir önemli event eksik veya loglanmıyor

2. **Pro Plan Kontrolleri Çalışıyor**  
   ✅ PASS: Free kullanıcı 51. mesajı göndermeye çalışınca 403 + `quota_exceeded` event  
   ❌ FAIL: Free kullanıcı limiti aşabiliyor veya hata mesajı yok

3. **Admin Stats Endpoint Doğru Veri Dönüyor**  
   ✅ PASS: `/api/admin/stats` toplam kullanıcı, dosya, mesaj sayısını doğru gösteriyor (manuel verification)  
   ❌ FAIL: İstatistikler yanlış veya endpoint 500 hatası veriyor

4. **PII Telemetry'de Yok**  
   ✅ PASS: Telemetry database'inde `grep -i "email\|phone\|@"` hiçbir PII bulmuyor  
   ❌ FAIL: Herhangi bir PII tespit edildi

5. **Admin Sadece Metadata Görüyor**  
   ✅ PASS: Admin UI'da mesaj içeriği, hücre değerleri gösterilmiyor; sadece event_type, timestamp, file_id  
   ❌ FAIL: Admin herhangi bir kullanıcı mesajı veya dosya içeriğini görebiliyor

6. **Admin Erişim Loglanıyor**  
   ✅ PASS: Admin `/api/admin/stats` çağırdığında audit log kaydı oluşuyor  
   ❌ FAIL: Admin erişimi loglanmıyor

7. **Build/Lint Geçer**  
   ✅ PASS: Backend/frontend build + lint hatasız  
   ❌ FAIL: Herhangi bir hata

---

## 7. Minimal Uygulama Planı (Maks 5 Adım)

### Adım 1: Backend - Telemetry Event Sistemi
**Dosyalar**: `services/telemetry.py` (yeni), `models/event.py` (yeni)  
**Değişiklikler**:
- `Event` modeli oluştur (event_type, timestamp, user_id, session_id, metadata JSON)
- `track_event(event_type, user_id, metadata)` helper fonksiyonu
- Kritik endpoint'lere event tracking ekle (upload, convert, agent message)  
**Gerekçe**: Merkezi telemetry altyapısı; tüm eventler standart formatta loglanır

### Adım 2: Backend - Pro Plan Feature Flags
**Dosyalar**: `middleware/plan_guard.py` (yeni), `models/user.py` (değiştir)  
**Değişiklikler**:
- `User` modeline `plan` field ekle (free/pro, default: free)
- `UserUsage` modeli oluştur (file_upload_count, message_count, period)
- Middleware: `check_quota(user, feature)` → 403 if exceeded
- Upload/agent endpoint'lerine quota kontrolü ekle  
**Gerekçe**: Free/Pro ayrımını zorla; limit aşımlarını engelle

### Adım 3: Backend - Admin Stats API
**Dosyalar**: `api/routes/admin.py` (yeni)  
**Değişiklikler**:
- `GET /api/admin/stats` endpoint (admin-only JWT decorator)
- Database aggregation: count users, files, messages, errors (bugün/bu hafta/bu ay)
- Top errors query (group by error_code, count)
- Response JSON (bölüm 4.3 şeması)  
**Gerekçe**: Admin'e sistem durumu görünürlüğü sağla; dashboard için data source

### Adım 4: Frontend - Pro Plan UI
**Dosyalar**: `components/UpgradeModal.tsx` (yeni), `hooks/usePlanCheck.ts` (yeni)  
**Değişiklikler**:
- `usePlanCheck` hook: kullanıcı planını kontrol et, kota aşımında modal göster
- `<UpgradeModal>`: "Bu özellik Pro için. [Yükselt]" mesajı + CTA
- Quota aşımında API error yakalanınca modal tetikle
- Pro kullanıcı için "PRO" badge göster (header'da)  
**Gerekçe**: Kullanıcıya limit durumunu net göster; upgrade yolunu aç

### Adım 5: Test + Audit Doğrulama
**Dosyalar**: `tests/test_telemetry.py` (yeni), `tests/test_plan_limits.py` (yeni)  
**Değişiklikler**:
- Event tracking testi: 10 farklı event tetikle, database'de doğru kaydedildiğini kontrol et
- Quota testi: Free user 50 mesaj gönder (OK), 51. mesaj 403 (FAIL)
- Admin API testi: stats endpoint doğru aggregation yapıyor mu?
- PII check: telemetry DB'de `grep` ile PII ara (bulunmamalı)  
**Gerekçe**: Tüm kriterleri doğrula; KVKK ve güvenlik gereksinimlerini sağla

---

## 8. Audit Checklist

### Dağıtım Öncesi PASS Kriterleri

**Telemetry**:
- [ ] Tüm önemli eventler (`user_registered`, `file_uploaded`, `agent_message_sent` vb.) loglanıyor
- [ ] Event schema standart (event_type, timestamp, user_id, metadata)
- [ ] Telemetry DB'de PII yok (`grep -i "email\|phone\|@"` sonuç: 0)
- [ ] Event retention: 90 gün (otomatik cleanup job var)

**Pro Plan**:
- [ ] Free user 50 mesaj sonrası 403 alıyor (test edildi)
- [ ] Free user 5MB+ dosya yükleyemiyor (test edildi)
- [ ] Pro user sınırsız mesaj/dosya gönderebiliyor
- [ ] Quota aşımında `quota_exceeded` event loglanıyor

**Admin**:
- [ ] `/api/admin/stats` endpoint sadece admin role ile erişilebilir (non-admin: 403)
- [ ] Admin dashboard doğru istatistikler gösteriyor (manuel check: user count, file count)
- [ ] Admin UI'da mesaj içeriği/hücre değerleri gösterilmiyor
- [ ] Admin erişimi audit log'a yazılıyor

**KVKK**:
- [ ] Telemetry'de hücre içeriği, mesaj içeriği yok
- [ ] Admin görünümünde e-posta maskelenmiş (`ah***@mail.com`)
- [ ] Kullanıcı hesap silme: tüm eventler hard delete (GDPR test)

**Kod Kalitesi**:
- [ ] `npm run build`, `pytest`: 0 hata
- [ ] `eslint`, `flake8`: 0 ihlal
- [ ] Kod review: TODO/FIXME yok

### FAIL Koşulları (Anında Engelleme)

**KRİTİK**:
- ❌ Telemetry'de PII bulundu (e-posta, mesaj içeriği, hücre değeri)
- ❌ Free user limiti aşabiliyor (quota kontrolü çalışmıyor)
- ❌ Admin non-admin kullanıcı tarafından erişilebiliyor (authentication bypass)

**YÜKSEK**:
- ❌ Önemli eventler loglanmıyor (eksik tracking)
- ❌ Admin stats yanlış veri gösteriyor
- ❌ Admin erişimi loglanmıyor (audit trail yok)

**ORTA**:
- ⚠️ Event schema tutarsız (bazı eventler farklı format)
- ⚠️ Quota aşımı UI mesajı kullanıcı dostu değil
- ⚠️ Admin UI yavaş (aggregation optimize edilmeli)

---

## Ek: Ölçeklenebilirlik Notları

**Başlangıç (MVP)**:
- Event storage: PostgreSQL (JSON field)
- Aggregation: SQL queries (günlük cron job)
- Admin UI: Simple React table

**Gelecek (Scale Edince)**:
- Event storage: Dedicated event store (örn: ClickHouse, Snowflake)
- Aggregation: Real-time (örn: Apache Kafka + stream processing)
- Admin UI: Advanced dashboard (Grafana, Metabase)

**Ancak**: MVP için PostgreSQL + basit SQL yeter. Erken optimizasyon yapma.

---

**Doküman Versiyonu**: 1.0  
**Son Güncelleme**: 2025-12-15  
**Sonraki Gözden Geçirme**: G3 + G4.1 tamamlandıktan sonra

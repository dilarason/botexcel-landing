# SEC-2025-12: RSC/React Flight RCE Patch Verification

**Güvenlik Açıkları**:
- GHSA-9qr9-h5gf-34mp
- CVE-2025-55182
- CVE-2025-66478

**Kaynak**: Vercel otomatik PR (React Server Components / React Flight RCE)  
**Mevcut Versiyon**: next 14.2.3  
**Amaç**: PR'ın patched sürümlere yükselttiğini ve build'ı bozmadığını kanıtlamak.

**Mod**: Security Patch Review + Risk + Audit Hazırlığı  
**Kod Yazılmayacak**: Bu bir doğrulama playbook'udur.

---

## 1. Scope (VAR / YOK)

### 1.1 VAR (In Scope)

**Paket Yükseltme Doğrulama**:
- `next` paketinin patched sürüme yükseltildiğini doğrula
- `react-server-dom-webpack`, `react-server-dom-parcel`, `react-server-dom-turbopack` patched sürümde
- `package.json` ve `pnpm-lock.yaml` diff incelemesi

**Lockfile Doğrulama**:
- `pnpm-lock.yaml` içinde transitive dependency'lerin de güvenli olduğunu kontrol
- Çakışan versiyon yok (multiple versions of same package)

**Lint/Build/Smoke**:
- `pnpm lint`: Hatasız geçmeli
- `pnpm build`: Production build başarılı olmalı
- `pnpm start` + smoke test: Ana sayfalar açılıyor olmalı

### 1.2 YOK (Out of Scope)

**Feature Değişikliği**: PR yalnızca güvenlik yaması, yeni özellik yok
**Refactor**: Kod mantığında değişiklik yok
**UI Değişimi**: Görsel değişiklik yok (tamamen arkayüz patch)
**Test Suite Ekleme**: Yeni test yazmaya gerek yok (mevcut testler yeterli)
**Deployment**: Bu playbook sadece verification, deploy ayrı karar

---

## 2. Beklenen Minimum Güvenli Sürümler

### 2.1 Next.js

**Patched Sürüm Aralığı**:
- `>= 14.2.22` (14.2.x serisinde patched minor)
- VEYA `>= 15.1.0` (15.x serisinde patched)

**Kontrol**:
- Eğer PR `next@14.2.3` → `next@14.2.22+` yükseltiyorsa → ✅ PASS
- Eğer PR `next@15.0.x` → `next@15.1.0+` yükseltiyorsa → ✅ PASS
- Eğer sürüm değişmemişse → ❌ FAIL (patch uygulanmamış)

### 2.2 React Server DOM Paketleri

**Patched Sürüm Aralığı**:
- `react-server-dom-webpack >= 19.0.0` (React 19'da patch var)
- `react-server-dom-parcel >= 19.0.0`
- `react-server-dom-turbopack >= 19.0.0` (eğer kullanılıyorsa)

**Alternatif** (Next.js 14.2.x için):
- `react-server-dom-webpack@18.3.x` serisinde patched sürüm (örn: `18.3.1+`)

**Kontrol**:
- `pnpm list` ile versiyonları kontrol et
- Tüm `react-server-dom-*` paketleri patched aralıkta olmalı

**Not**: Kesin patch sürümü PR diff'inde görülecek. Yukarıdaki aralıklar CVE duyurularına göre genel beklenti.

---

## 3. Doğrulama Komut Seti

Aşağıdaki komutları sırayla çalıştır. Tüm komutlar `botexcel-landing/` dizininden çalıştırılacak.

### 3.1 PR Branch Checkout

```bash
cd /home/ted/botexcel/botexcel-landing

# PR branch bilgisini al (Vercel bot PR numarasını kullan, örn: pr-123)
git fetch origin pull/123/head:vercel-security-patch

# Branch'e geç
git checkout vercel-security-patch
```

**Alternatif** (eğer PR remote branch olarak varsa):
```bash
git fetch origin
git checkout vercel/security-patch  # Branch adını PR'dan al
```

### 3.2 Değişiklikleri İncele

```bash
# package.json değişikliklerini gör
git diff main -- package.json

# pnpm-lock.yaml değişikliklerini gör (özet)
git diff main -- pnpm-lock.yaml | head -100
```

**Beklenen**: `next`, `react-server-dom-webpack`, `react-server-dom-parcel` sürüm yükseltmeleri görülmeli.

### 3.3 Temiz Kurulum

```bash
# Mevcut node_modules ve cache'i temizle
rm -rf node_modules .next

# Lockfile'ı kullanarak kurulum
pnpm install --frozen-lockfile
```

**Beklenen Çıktı**: Hatasız kurulum, uyarı olabilir ama hata OLMAMALI.

### 3.4 Paket Versiyonlarını Doğrula

```bash
# Next.js versiyonu
pnpm list next

# React ecosystem versiyonları
pnpm list react react-dom react-server-dom-webpack react-server-dom-parcel react-server-dom-turbopack
```

**PASS Kriteri**:
- `next@14.2.22` veya üstü (14.x serisi için)
- `next@15.1.0` veya üstü (15.x serisi için)
- `react-server-dom-*` paketleri patched sürümde (örn: `19.0.0+` veya `18.3.1+`)

**FAIL Kriteri**:
- `next@14.2.3` veya altı (patched değil)
- `react-server-dom-webpack` sürümü CVE'den etkilenen aralıkta

### 3.5 Lint Kontrolü

```bash
pnpm lint
```

**PASS Kriteri**: Çıktı `✓ No ESLint warnings or errors` veya benzeri, exit code 0

**FAIL Kriteri**: Herhangi bir ESLint hatası, exit code 1

**Uyarı**: Eğer ESLint uyarıları varsa (errors değil, warnings) → CONDITIONAL (merge edilebilir ama uyarıları incele)

### 3.6 Production Build

```bash
pnpm build
```

**PASS Kriteri**:
- Build başarıyla tamamlanır
- Çıktıda "Compiled successfully" veya benzeri mesaj
- `.next/` dizini oluşturulur
- Exit code 0

**FAIL Kriteri**:
- Build hatası (örn: TypeScript error, webpack error)
- Exit code 1

### 3.7 Smoke Test (Runtime Doğrulama)

```bash
# Production build'i başlat (arka planda)
pnpm start &
SERVER_PID=$!

# 5 saniye bekle (server'ın başlaması için)
sleep 5

# Ana sayfa smoke test
curl -I http://localhost:3000

# Health endpoint (varsa)
curl -I http://localhost:3000/api/health

# Server'ı durdur
kill $SERVER_PID
```

**PASS Kriteri**:
- Ana sayfa: `HTTP/1.1 200 OK`
- Health endpoint: `HTTP/1.1 200 OK` (varsa)
- Console'da kritik hata yok

**FAIL Kriteri**:
- Ana sayfa: `500 Internal Server Error`
- Server başlamıyor (crash)
- Console'da runtime error (örn: "Module not found", "Cannot read property...")

---

## 4. PASS/FAIL Kuralları

### 4.1 PASS (Merge Güvenli)

**Tüm koşullar sağlanmalı**:
- ✅ `next` ve `react-server-dom-*` paketleri patched sürüm aralığında
- ✅ `pnpm install --frozen-lockfile` hatasız
- ✅ `pnpm lint` geçer (warnings kabul edilebilir, errors değil)
- ✅ `pnpm build` başarılı
- ✅ `pnpm start` + smoke test başarılı (200 OK)
- ✅ `pnpm-lock.yaml` diff'i sadece versiyon yükseltmeleri içeriyor (yeni paket yok)

### 4.2 FAIL (Merge Engellenmeli)

**Herhangi biri sağlanırsa**:
- ❌ Paket versiyonları patched aralıkta DEĞİL (hala vulnerable)
- ❌ `pnpm install` hata veriyor (dependency conflict)
- ❌ `pnpm lint` ESLint errors veriyor
- ❌ `pnpm build` başarısız
- ❌ `pnpm start` crash ediyor veya smoke test 500 veriyor

### 4.3 CONDITIONAL (İnceleme Gerekli)

**Ek inceleme gerektirecek durumlar**:
- ⚠️ Paketler patched ama Node sürümü uyumsuzluk riski var (örn: Node 24+ gerekiyor, mevcut 20)
- ⚠️ `pnpm-lock.yaml`'da beklenmedik paket eklenmiş (transitive dependency değişimi)
- ⚠️ Lint warnings artmış (errors yok ama warning sayısı 2x artmış)
- ⚠️ Build süresi anormal uzamış (örn: 2 dakikadan 10 dakikaya)

**Aksiyonlar**:
- Node versiyon gereksinimi kontrol et: `package.json` "engines" field
- `.node-version` dosyası ekle (eğer yoksa)
- Transitive dependency değişimini `pnpm why <paket-adı>` ile incele
- Build süre artışı kabul edilebilir mi değerlendir (güvenlik > performans)

---

## 5. Risk Notları

### Risk 1: Node.js Versiyon Uyumsuzluğu

**Senaryo**: Patched `next` veya `react` paketleri Node.js 20+ gerektirebilir, mevcut production Node 18 kullanıyor.

**Tespit**:
```bash
# package.json'da "engines" kontrol et
grep -A 2 "engines" package.json

# Mevcut Node versiyonu
node -v
```

**Önleme**:
- `.node-version` dosyası ekle: `echo "20.11.0" > .node-version`
- `package.json` "engines" field'ı güncelle:
  ```json
  "engines": {
    "node": ">=20.11.0"
  }
  ```
- Vercel deployment settings'te Node versiyonunu ayarla

### Risk 2: Monorepo ESLint Sızıntısı

**Senaryo**: `botexcel-landing/` üst dizindeki `botexcel/` ESLint config'i ile çakışma.

**Tespit**:
```bash
# ESLint config hierarchy kontrol
cd /home/ted/botexcel/botexcel-landing
npx eslint --print-config app/page.tsx | grep "configFilePath"
```

**Önleme**:
- `botexcel-landing/.eslintrc.json` içine `"root": true` ekle
- Üst dizin config'i yok sayılır

### Risk 3: Stale `.next` Cache

**Senaryo**: Eski build cache'i yeni paketlerle uyumsuz.

**Tespit**: Build sırasında garip hatalar (örn: "Module parse failed").

**Önleme**:
- PR merge öncesi: `rm -rf .next node_modules && pnpm install && pnpm build`
- CI/CD pipeline'da cache invalidate et

### Risk 4: Transitive Dependency Breaking Change

**Senaryo**: `next` yükseltmesi, bir alt bağımlılığın breaking change içeren versiyonunu çekebilir.

**Tespit**:
```bash
# Lockfile diff'inde beklenmedik paket değişimleri ara
git diff main -- pnpm-lock.yaml | grep "+" | grep -v "next\|react"
```

**Önleme**:
- `pnpm audit` çalıştır (yeni vulnerabilities var mı?)
- Şüpheli paket değişimlerini `pnpm why <paket>` ile incele

---

## 6. Merge Kararı Şablonu

### 6.1 MERGE NOW (Hemen Merge Et)

**Koşullar** (tümü sağlanmalı):
1. ✅ Bölüm 4.1 PASS kriterleri tümü sağlandı
2. ✅ Risk Notları (bölüm 5) incelendi, kritik risk YOK
3. ✅ Verification komutları manuel çalıştırıldı, sonuçlar doğrulandı
4. ✅ Vercel bot'un PR açıklaması incelendi, CVE listesi eşleşiyor

**Aksiyon**:
```bash
git checkout main
git merge --no-ff vercel-security-patch -m "sec: patch RSC/React Flight RCE (GHSA-9qr9-h5gf-34mp)"
git push origin main
```

**Commit Mesajı Formatı**:
```
sec: patch RSC/React Flight RCE vulnerabilities

- GHSA-9qr9-h5gf-34mp
- CVE-2025-55182
- CVE-2025-66478

Packages updated:
- next: 14.2.3 → 14.2.22
- react-server-dom-webpack: 18.3.0 → 18.3.1
- react-server-dom-parcel: 18.3.0 → 18.3.1

Verification:
- Lint: PASS
- Build: PASS
- Smoke test: PASS

Co-authored-by: vercel[bot] <...>
```

### 6.2 BLOCK MERGE (Merge'i Engelle)

**Koşullar** (herhangi biri):
1. ❌ Bölüm 4.2 FAIL kriterlerinden herhangi biri sağlandı
2. ❌ Build veya smoke test başarısız
3. ❌ Paket versiyonları hala vulnerable aralıkta
4. ❌ Beklenmedik kod değişikliği var (sadece `package.json` + `pnpm-lock.yaml` olmalı)

**Aksiyon**:
- PR'a yorum yaz: "Verification failed: [sebep]. Blocked."
- Vercel support'a ticket aç (eğer bot hatası varsa)
- Manuel patch uygula (eğer bot PR'ı bozuksa):
  ```bash
  pnpm update next@latest
  pnpm update react-server-dom-webpack@latest react-server-dom-parcel@latest
  # Sonra tekrar verification
  ```

### 6.3 HOLD (Ek İnceleme Gerekli)

**Koşullar** (Bölüm 4.3 CONDITIONAL):
- ⚠️ Node versiyon uyumsuzluğu riski
- ⚠️ Transitive dependency'de beklenmedik değişim
- ⚠️ Lint warnings artmış

**Aksiyon**:
- Risk analizi yap (bölüm 5)
- Eğer riskler kabul edilebilirse → MERGE NOW
- Eğer riskler çok yüksekse → BLOCK, manuel patch tercih et

---

## 7. Post-Merge Checklist

Merge sonrası **24 saat içinde**:

- [ ] Production deployment başarılı (Vercel dashboard kontrol)
- [ ] Production smoke test (canlı site'ta `curl -I https://botexcel.com`)
- [ ] Error monitoring kontrol (Sentry/LogRocket, spike var mı?)
- [ ] Kullanıcı raporları izle (ilk 24 saatte bug report artışı var mı?)
- [ ] Güvenlik tarayıcı çalıştır: `pnpm audit` (yeni vulnerability yok mu?)

**ROLLBACK Kriteri**:
- Production'da kritik bug (site açılmıyor, 500 hataları)
- Error rate %5'in üstüne çıktı
- Kullanıcılardan şikayet yağmuru (bug reports 10x arttı)

**Rollback Komutu**:
```bash
git revert HEAD
git push origin main
# Vercel otomatik deploy edecek
```

---

## 8. Referanslar

**CVE Duyuruları**:
- GHSA-9qr9-h5gf-34mp: [GitHub Advisory URL]
- CVE-2025-55182: [NVD URL]
- CVE-2025-66478: [NVD URL]

**Next.js Release Notes**:
- https://github.com/vercel/next.js/releases

**React Release Notes**:
- https://github.com/facebook/react/releases

---

**Doküman Versiyonu**: 1.0  
**Son Güncelleme**: 2025-12-15  
**Sonraki Gözden Geçirme**: PR merge edildiğinde güncellenecek (gerçek sürüm numaraları ile)

# G3: Agent Excel Context Lock — QA Decisions

This document tracks QA review decisions for the G3 implementation (Agent → Real Product Integration with Context Lock).

---

## QA Decision — 2025-12-15

**Status**: ✅ **ACCEPT** (with conditions)

**Scope**:
- Backend local integration (ECONNREFUSED fix)
- Next.js agent context route (`/api/agent/context/create`)
- Flask backend startup and reachability

---

### Findings

#### Issue 1: ImportError on Backend Startup
- **Symptom**: `uvicorn main:app` crashes with `ImportError: cannot import name 'log_to_ndjson' from 'converter'`
- **Root Cause**: `main.py` line 5 imports `log_to_ndjson` from `converter.py`, but this function doesn't exist in that module
- **Impact**: Backend cannot start → ECONNREFUSED for all Next.js API routes including `/api/agent/context/create`

#### Issue 2: Wrong ASGI Entrypoint
- **Symptom**: Attempting `uvicorn main:app` to start web server
- **Root Cause**: 
  - `main.py` is a **CLI batch processing tool**, not a web server
  - Actual web server is **Flask app** in `api.py` (line 72: `app = Flask(__name__)`)
  - Correct entrypoint is `api:app` not `main:app`
- **Impact**: Even if ImportError fixed, `main:app` would not serve HTTP requests on port 5000

#### Issue 3: Next.js Proxy Configuration
- **Symptom**: Next.js `/api/agent/context/create` returns 500 ECONNREFUSED
- **Root Cause**: Next.js routes expect backend at `http://127.0.0.1:5000`, but backend not running on this address
- **Impact**: G3 context creation endpoint unreachable from frontend

---

### Accepted Fix

#### Fix 1: Add Compatibility Shim (MINIMAL)

Add to `converter.py` (end of file):

```python
def log_to_ndjson(step: str, action: str, extra: dict) -> bool:
    """
    Compatibility shim for main.py CLI tool.
    
    This function exists solely for backward compatibility with main.py.
    Web API should use audit_trail.append() directly.
    """
    from audit_trail import append
    return append(step=step, action=action, **extra)
```

**Justification**:
- ✅ Preserves backward compatibility (main.py CLI still works)
- ✅ Clearly marked as compatibility layer (docstring explains purpose)
- ✅ Does not hide defects (delegates to proper `audit_trail.append()`)
- ✅ Minimal change (3 lines + docstring)
- ✅ Reversible (can be removed after main.py refactor)

---

#### Fix 2: Use Correct Backend Startup Command

**WRONG**:
```bash
uvicorn main:app --host 127.0.0.1 --port 5000
```

**CORRECT**:
```bash
# Recommended: gunicorn (production-ready WSGI server)
gunicorn api:app --bind 127.0.0.1:5000 --workers 2 --timeout 120

# Alternative: Flask dev server (adequate for local dev)
python -m flask --app api:app run --host 127.0.0.1 --port 5000
```

**Justification**:
- ✅ Correct entrypoint (`api:app` is the Flask application)
- ✅ Flask is WSGI, gunicorn is native WSGI server (better than uvicorn wrapping)
- ✅ Production-ready with worker processes
- ✅ Explicit documentation prevents future confusion

---

#### Fix 3: Verify Next.js Configuration

**Action**: Confirm `.env.local` contains backend URL

```bash
# botexcel-landing/.env.local should have:
BOTEXCEL_API_BASE=http://127.0.0.1:5000
```

If missing, add it.

---

### Rejected Fix

#### Option: Refactor main.py to Use audit_trail Directly

```python
# main.py line 5: Remove log_to_ndjson from import
-from converter import convert_input, log_to_ndjson
+from converter import convert_input
+from audit_trail import append as log_to_ndjson
```

**Why REJECT**:
- ❌ Architecturally cleaner, but **does not solve ECONNREFUSED**
- ❌ `main.py` is a CLI tool, not used by web API
- ❌ Changing main.py has **zero impact** on web API startup
- ❌ Does not address the actual problem (backend reachability)

---

#### Option: Convert Flask to FastAPI

**Why REJECT**:
- ❌ Massive refactor (1392 lines of Flask code in `api.py`)
- ❌ Violates "minimally invasive" quality bar
- ❌ Introduces new risks (test coverage, regressions)
- ❌ NOT reversible
- ❌ NOT aligned with G3 scope (context lock, not backend framework migration)

---

### Verification Checklist

Execute in sequence. All steps must pass.

#### Step 1: Add Compatibility Shim

```bash
cd /home/ted/botexcel

# Append function to converter.py
cat >> converter.py << 'EOF'

def log_to_ndjson(step: str, action: str, extra: dict) -> bool:
    """
    Compatibility shim for main.py CLI tool.
    
    This function exists solely for backward compatibility with main.py.
    Web API should use audit_trail.append() directly.
    """
    from audit_trail import append
    return append(step=step, action=action, **extra)
EOF
```

**Expected**: File updated, no errors

---

#### Step 2: Verify CLI Tool (Optional Sanity Check)

```bash
python main.py --help
```

**Expected**: Usage info displayed (not ImportError)

---

#### Step 3: Install WSGI Server

```bash
cd /home/ted/botexcel
source .venv/bin/activate

# Install gunicorn if not present
pip install gunicorn
```

**Expected**: `gunicorn` installed successfully

---

#### Step 4: Start Backend

```bash
cd /home/ted/botexcel
source .venv/bin/activate

gunicorn api:app --bind 127.0.0.1:5000 --workers 2 --timeout 120
```

**Expected Output**:
```
[INFO] Starting gunicorn 21.2.0
[INFO] Listening at: http://127.0.0.1:5000
[INFO] Booted worker with pid: XXXXX
```

**MUST NOT SEE**:
- ImportError
- ModuleNotFoundError
- Address already in use

---

#### Step 5: Health Check

**New terminal**:

```bash
curl -i http://127.0.0.1:5000/api/health
```

**Expected**:
```
HTTP/1.1 200 OK
Content-Type: application/json

{"ok":true,"status":"healthy"}
```

**OR** (if /api/health doesn't exist):
```bash
curl -i http://127.0.0.1:5000/
```

**Expected**:
```
HTTP/1.1 200 OK

{"ok":true,"service":"botexcel",...}
```

✅ **PASS**: 200 OK response  
❌ **FAIL**: Connection refused, timeout, or 500 error

---

#### Step 6: Verify Next.js Configuration

```bash
cd /home/ted/botexcel/botexcel-landing

# Check .env files
grep -r "BOTEXCEL_API_BASE\|API_BASE" .env* 2>/dev/null
```

**Expected**: Should show `127.0.0.1:5000`

**If NOT found**, add to `.env.local`:
```bash
echo "BOTEXCEL_API_BASE=http://127.0.0.1:5000" >> .env.local
```

---

#### Step 7: Test Next.js → Backend Integration

**Terminal 1**: gunicorn running (`gunicorn api:app --bind 127.0.0.1:5000`)

**Terminal 2**: Start Next.js
```bash
cd /home/ted/botexcel/botexcel-landing
pnpm dev
```

**Terminal 3**: Test proxy route
```bash
curl -i -X POST http://localhost:3000/api/agent/context/create \
  -H "Content-Type: application/json" \
  -d '{"file_id":"test123"}'
```

**PASS Conditions** (backend is reachable):
- ✅ `401 Unauthorized` (auth required)
- ✅ `400 Bad Request` (validation error)
- ✅ `200 OK` or `201 Created` (success)

**FAIL Condition**:
- ❌ `500 Internal Server Error` with `ECONNREFUSED` in body

---

#### Step 8: Check Backend Request Logs

**In Terminal 1** (gunicorn logs), verify:
```
127.0.0.1 - - [15/Dec/2025 04:20:00] "POST /api/agent/context/create HTTP/1.1" 401 -
```

(Status code may be 200, 201, 400, 401, 403 — all indicate backend received request)

---

### Acceptance Criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Backend starts without ImportError | ✅ After shim added |
| 2 | Backend listens on 127.0.0.1:5000 | ✅ After gunicorn started |
| 3 | Direct curl returns valid response | ✅ Step 5 passes |
| 4 | Next route returns 4xx/2xx (not ECONNREFUSED) | ✅ Step 7 passes |

**GREEN LIGHT**: All 4 criteria must pass before proceeding with G3 implementation.

---

### Rollback Plan

If issues arise after applying fixes:

```bash
# Stop backend
pkill -f "gunicorn api:app"

# Revert compatibility shim
cd /home/ted/botexcel
git checkout converter.py
# OR manually delete the last function added to converter.py
```

---

### Post-Fix Documentation Required

After successful verification, **MUST** update:

#### 1. Project README
Add "Local Development - Backend Startup" section with correct `gunicorn` command

#### 2. `.env.local.example`
```bash
# Backend API base URL (local development)
BOTEXCEL_API_BASE=http://127.0.0.1:5000
```

---

### Security & KVKK Notes

- ✅ **NO SECURITY IMPACT**: Only addresses import resolution and server startup
- ✅ **NO PII CONCERNS**: No changes to data handling or logging
- ✅ **AUDIT TRAIL**: Shim delegates to existing KVKK-compliant `audit_trail.append()` (IP pseudonymization preserved)

---

**QA Approval**: ✅ **GRANTED**  
**Approver**: Antigravity (QA Gatekeeper)  
**Date**: 2025-12-15  
**Condition**: Execute full verification checklist before declaring G3 backend integration complete

---

**Next Action**: Execute Steps 1-8 in verification checklist sequentially

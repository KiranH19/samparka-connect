# Samparka Load Testing & 500-User Capacity Plan

This document details the performance architecture, load testing methodology, and capacity planning for the **Samparka** platform, specifically designed to handle **500 concurrent active users** in Hubli–Dharwad and Karnataka.

---

## 1. Capacity Goals & Targets

| Metric | Target | Rationale |
| :--- | :--- | :--- |
| **Simultaneous Virtual Users (VUs)** | 500 Concurrent | Typical regional traffic spikes during hiring drives and campus seasons |
| **Error Rate** | < 1.0% | Strict production reliability target |
| **P95 HTTP Latency** | < 1,000 ms (1s) | Ensures snappy mobile responsiveness over 4G/5G networks |
| **Job Search P95** | < 800 ms | Instant filtering by city, locality, and category |
| **Data Integrity** | Zero Duplicates | Database unique constraint `(job_id, applicant_id)` prevents race conditions |

---

## 2. Architecture & Optimizations for 500 Active Users

1. **Database Indexes**:
   - High-throughput composite index on `(status, published_at DESC)` ensures queries for active jobs bypass full table scans.
   - B-Tree indexes on `city`, `locality`, and `category` ensure sub-10ms filter resolution.
   - Foreign key indexing prevents table locks during relational updates.

2. **Connection Pooling**:
   - Supabase / PostgreSQL provides PgBouncer on port `6543` in transaction pooling mode.
   - Client connections are multiplexed, preventing PostgreSQL connection exhaustion at 500 concurrent sessions.

3. **Client-Side Optimization**:
   - Search queries use debounce to avoid flooding requests on keystrokes.
   - Assets and SVG iconography are lightweight (zero heavy external image network round-trips).
   - Responsive loading states prevent cumulative layout shifts (CLS).

4. **Security & RLS**:
   - Row Level Security policies evaluate using Postgres indexed fields and `auth.uid()`.
   - Admin functions run with `SECURITY DEFINER` and strict schema search paths.

---

## 3. Running the k6 Load Test

### Prerequisites
Install k6 on your test runner:
```bash
# macOS
brew install k6

# Debian / Ubuntu
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### Execution
Run the load test against your staging or local environment:
```bash
# Against staging deployment
k6 run -e TARGET_URL=https://your-staging-domain.com load-tests/k6-load-test.js

# Against local development
k6 run -e TARGET_URL=http://localhost:3000 load-tests/k6-load-test.js
```

---

## 4. Test Scenario Flow
1. **Ramp-Up (1 min)**: 0 to 50 VUs (initial cache priming).
2. **Traffic Surge (2 min)**: 50 to 200 VUs (simulates morning peak job browsing).
3. **Target Load (3 min)**: 200 to 500 VUs (peak simultaneous load).
4. **Sustained Peak (2 min)**: Sustained 500 VUs executing searches, applications, and employer dashboard actions.
5. **Cool-Down (1 min)**: Graceful ramp-down to 0.

---

## 5. Failure Diagnosis & Bottlenecks
If the error rate exceeds 1% or latency exceeds 1s:
- Check Supabase Database CPU & RAM in Supabase Studio.
- Verify connection pool mode is set to **Transaction** (not Session).
- Check `pg_stat_statements` for unindexed slow queries.

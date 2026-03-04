# Load Testing Guide for USDT Exchange

## Prerequisites
Before load testing, ensure you have:
1. ✅ Deployed to Vercel (production or preview)
2. ✅ Upgraded to **Vercel Pro** ($20/month) - Free tier will throttle/fail
3. ✅ Upgraded **Vercel Postgres** to a paid compute tier in your Vercel dashboard

## Quick Start: Using Artillery (Recommended)

### Installation
```bash
npm install -g artillery@latest
```

### Basic Load Test

Create a test configuration file:

```yaml
# artillery-config.yml
config:
  target: "https://your-app.vercel.app"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Spike test"
  processor: "./load-test-helpers.js"

scenarios:
  - name: "Create Order Flow"
    flow:
      - post:
          url: "/api/orders"
          json:
            amount: "{{ $randomNumber(10, 1000) }}"
            network: "{{ $randomString() }}"
            email: "test{{ $randomNumber(1, 10000) }}@example.com"
            walletAddress: "{{ $randomString() }}"
      - think: 2

  - name: "Admin Dashboard"
    flow:
      - get:
          url: "/api/admin/orders"
      - think: 3
```

### Run the test
```bash
artillery run artillery-config.yml --output report.json
artillery report report.json
```

## Alternative: Using K6

### Installation
```bash
# Windows (via Chocolatey)
choco install k6

# Or download from https://k6.io/docs/get-started/installation/
```

### Basic K6 Script

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp up to 50 users
    { duration: '3m', target: 50 },   // Stay at 50 users
    { duration: '1m', target: 200 },  // Spike to 200 users
    { duration: '2m', target: 200 },  // Stay at 200 users
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate must be below 1%
  },
};

const BASE_URL = 'https://your-app.vercel.app';

export default function () {
  // Test order creation
  const payload = JSON.stringify({
    amount: Math.floor(Math.random() * 1000) + 10,
    network: 'TRC20',
    email: `test${Math.random()}@example.com`,
    walletAddress: `wallet${Math.random()}`,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/api/orders`, payload, params);
  
  check(res, {
    'status is 201': (r) => r.status === 201,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

### Run K6 Test
```bash
k6 run load-test.js
```

## What to Monitor During Tests

### 1. Vercel Dashboard
- Function execution time
- Function invocations
- Error rate
- Bandwidth usage

### 2. Database Metrics (Vercel Postgres Dashboard)
- Connection count (should stay below your plan limit)
- Query duration
- CPU usage
- Memory usage

### 3. Key Performance Indicators (KPIs)
- **Response Time**: p95 should be < 500ms
- **Error Rate**: Should be < 1%
- **Throughput**: Requests per second your app can handle
- **Database Connections**: Should not hit the limit

## Expected Results by Tier

### Free Tier (NOT RECOMMENDED)
- ❌ Will fail at ~10-20 concurrent users
- ❌ Database connection limit: ~20
- ❌ Function timeout: 10s

### Vercel Pro + Postgres Starter ($25/month)
- ✅ Can handle ~100-500 concurrent users
- ✅ Database connections: ~100
- ✅ Function timeout: 60s

### Vercel Pro + Postgres Pro ($90/month)-
- ✅ Can handle ~1,000-5,000 concurrent users
- ✅ Database connections: ~1,000
- ✅ Better query performance

## Troubleshooting Common Issues

### Issue: "Too many connections"
**Solution**: Enable connection pooling
- Use Prisma Accelerate (built-in pooling)
- Or add PgBouncer

### Issue: High response times
**Solution**: 
- Check if indexes are working: `EXPLAIN ANALYZE` your queries
- Enable caching for read-heavy endpoints

### Issue: Function timeouts
**Solution**:
- Optimize database queries
- Add pagination to admin dashboard
- Use streaming responses for large datasets

## Next Steps After Testing

1. **Identify Bottlenecks**: Check which endpoints are slowest
2. **Optimize Queries**: Use Prisma's query logging
3. **Add Caching**: Implement Redis for frequently accessed data
4. **Monitor in Production**: Set up Vercel Analytics or Sentry

## Cost Estimation for Scale

| Users/Day | Vercel Plan | DB Plan | Est. Monthly Cost |
|-----------|-------------|---------|-------------------|
| 1,000     | Pro         | Starter | $45               |
| 10,000    | Pro         | Pro     | $110              |
| 100,000   | Pro         | Scale   | $300+             |
| 1,000,000 | Enterprise  | Custom  | $1,000+           |

---

**Remember**: The schema changes we made (Decimal + Indexes) are CRITICAL for these tests to succeed. Without indexes, performance degrades exponentially with data growth.

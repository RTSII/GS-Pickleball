# Contract: Programs Search API

**Endpoint**: `GET /api/search/programs`  
**Query**: `q, kind=lesson|clinic|league|ladder|tournament, level, from=YYYY-MM-DD`

## Request example
```
GET /api/search/programs?kind=lesson&level=3.0&from=2025-10-01
```

## Response example
```json
{ "hits": [ { "document": {
  "id":"p_1","venue_id":"v_123","kind":"lesson",
  "level_min":3.0,"level_max":3.5,"start_ts":1737422400
}}]}
```

## Errors
- 400 invalid params
- 502 search backend unavailable

## SLAs
- P95 ≤150 ms

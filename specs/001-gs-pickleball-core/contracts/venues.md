# Contract: Venues Search API

**Endpoint**: `GET /api/search/venues`  
**Query**: `q, lat, lng, indoor, lights, open`

## Request example
```
GET /api/search/venues?q=&lat=33.462&lng=-79.121&indoor=true&open=true
```

## Response example
```json
{ "hits": [ { "document": {
  "id":"v_123","name":"LBTS Courts","city":"Pawleys Island",
  "indoor":false,"lights":true,"open_now":true,"_geo":[33.46,-79.12],
  "book_url":"https://example.com/book"
}}]}
```

## Errors
- 400 invalid query params
- 502 search backend unavailable → retry with backoff

## SLAs
- P95 ≤150 ms
- P99 ≤300 ms

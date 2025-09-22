# Quickstart validation scenarios

1) **Open-now in Pawleys**
   - Call `/api/search/venues?lat=33.462&lng=-79.121&open=true`
   - Expect ≥1 result; verify `open_now=true` on first hit.

2) **Indoor-only filter**
   - Call with `indoor=true`; verify all hits have `indoor=true`.

3) **Lesson for 3.0**
   - Call `/api/search/programs?kind=lesson&level=3.0&from=2025-09-20`
   - Verify each hit satisfies `level_min ≤ 3.0 ≤ level_max`.

4) **Typo tolerance**
   - Use `q=pikleball`; expect top local venues.

5) **Performance**
   - 20 sequential venue searches complete with P95 ≤150 ms.

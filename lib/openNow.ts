/**
 * Determine if a venue is open at the provided time according to a weekly hours map.
 *
 * Expected shape:
 * {
 *   tz?: string,               // IANA timezone, defaults to America/New_York
 *   mon?: [ ["HH:MM","HH:MM"], ... ],
 *   tue?: [ ["HH:MM","HH:MM"], ... ],
 *   wed?: ..., thu?: ..., fri?: ..., sat?: ..., sun?: ...
 * }
 */
export function isOpenNow(hours: Record<string, unknown> | null, now: Date = new Date()): boolean {
  if (!hours) return false;
  const tz = (hours as any)?.tz ?? "America/New_York";
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts = fmt.formatToParts(now);
  const day = parts.find(p => p.type === "weekday")!.value.toLowerCase().slice(0,3);
  const hh = parts.find(p => p.type === "hour")!.value;
  const mm = parts.find(p => p.type === "minute")!.value;
  const cur = `${hh}:${mm}`;
  const ranges: [string, string][] = ((hours as any)?.[day] ?? []) as [string, string][];
  return ranges.some(([a,b]) => a <= cur && cur <= b);
}

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

  // helper: HH:MM -> minutes since midnight
  const toMin = (s: string) => {
    const [H, M] = s.split(":").map(Number);
    return (H % 24) * 60 + (M % 60);
  };
  const curMin = toMin(cur);
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
  const idx = days.indexOf(day as any);
  const prevDay = days[(idx + 6) % 7];

  const todayRanges: [string, string][] = ((hours as any)?.[day] ?? []) as [string, string][];
  const prevRanges: [string, string][] = ((hours as any)?.[prevDay] ?? []) as [string, string][];

  // 1) Check today's ranges
  for (const [a, b] of todayRanges) {
    const aMin = toMin(a);
    const bMin = toMin(b);
    if (aMin <= bMin) {
      // Normal same-day window
      if (aMin <= curMin && curMin <= bMin) return true;
    } else {
      // Overnight starting today (e.g., 22:00-02:00). For today we cover [a, 24:00)
      if (curMin >= aMin) return true;
    }
  }

  // 2) Check previous day's overnight ranges that wrap into today
  for (const [a, b] of prevRanges) {
    const aMin = toMin(a);
    const bMin = toMin(b);
    if (aMin > bMin) {
      // Overnight that spills into today covers (00:00, b]
      if (curMin <= bMin) return true;
    }
  }

  return false;
}

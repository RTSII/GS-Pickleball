import { describe, it, expect } from "vitest";
import { isOpenNow } from "../../lib/openNow";

/**
 * Baseline tests for isOpenNow(hours, now)
 * - Typical daytime hours
 * - Closed day (no entry)
 * - Overnight hours (document current limitation)
 * - Timezone-aware evaluation
 */

describe("isOpenNow", () => {
  it("returns true during typical open hours on the same day (ET)", () => {
    const hours = {
      tz: "America/New_York",
      mon: [["09:00", "17:00"]],
    } as const;
    // 2025-09-22 is a Monday. 13:00 ET == 17:00Z.
    const now = new Date("2025-09-22T17:00:00Z");
    expect(isOpenNow(hours as any, now)).toBe(true);
  });

  it("returns false when closed on that weekday (missing key)", () => {
    const hours = {
      tz: "America/New_York",
      mon: [["09:00", "17:00"]],
      // 'tue' intentionally omitted to represent closed
    } as const;
    // Tuesday 15:00 ET == 19:00Z
    const now = new Date("2025-09-23T19:00:00Z");
    expect(isOpenNow(hours as any, now)).toBe(false);
  });

  it("returns true for overnight ranges that wrap past midnight (spill into next day)", () => {
    const hours = {
      tz: "America/New_York",
      fri: [["22:00", "02:00"]], // Not supported by current simple range check
    } as const;
    // Saturday 01:00 ET == 05:00Z
    const now = new Date("2025-09-27T05:00:00Z");
    expect(isOpenNow(hours as any, now)).toBe(true);
  });

  it("returns true during late-night on the start day for an overnight window", () => {
    const hours = {
      tz: "America/New_York",
      fri: [["22:00", "02:00"]],
    } as const;
    // Friday 23:30 ET == Saturday 03:30Z
    const now = new Date("2025-09-27T03:30:00Z");
    expect(isOpenNow(hours as any, now)).toBe(true);
  });

  it("respects provided IANA timezone when evaluating time-of-day", () => {
    const hours = {
      tz: "America/Los_Angeles",
      mon: [["09:00", "10:00"]],
    } as const;
    // Monday 09:30 PT == 17:30Z on 2025-01-06
    const now = new Date("2025-01-06T17:30:00Z");
    expect(isOpenNow(hours as any, now)).toBe(true);
  });
});

import { describe, it, expect } from "vitest";
import { isOpenNow } from "../lib/openNow";

const hours = {
  tz: "America/New_York",
  mon: [["08:00", "12:00"], ["13:00", "17:00"]],
  tue: [["00:00", "23:59"]],
};

describe("isOpenNow", () => {
  it("returns true during open interval", () => {
    const d = new Date("2024-01-01T15:30:00-05:00"); // Monday 15:30 ET
    expect(isOpenNow(hours, d)).toBe(true);
  });

  it("returns false outside intervals", () => {
    const d = new Date("2024-01-01T12:30:00-05:00"); // Monday 12:30 ET (gap)
    expect(isOpenNow(hours, d)).toBe(false);
  });

  it("handles 24/7 days", () => {
    const d = new Date("2024-01-02T03:00:00-05:00"); // Tuesday 03:00 ET
    expect(isOpenNow(hours, d)).toBe(true);
  });

  it("returns false if hours missing", () => {
    expect(isOpenNow(null)).toBe(false);
  });
});

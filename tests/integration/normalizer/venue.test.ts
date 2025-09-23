import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { normalizeVenue } from "../../../scripts/normalizer/venue";

describe("normalizeVenue contract", () => {
  it("produces a merge patch with confidence from raw fixture", () => {
    const raw = JSON.parse(readFileSync(resolve(__dirname, "../../fixtures/normalizer/venue-raw.json"), "utf8"));
    const patch = normalizeVenue(raw);
    expect(patch.op).toBe("upsert");
    expect(patch.entity).toBe("Venue");
    expect(patch.after.name).toBe("LBTS Courts");
    expect(patch.after.city).toBe("Pawleys Island");
    expect(patch.after.feeMin).toBe(500);
    expect(patch.after.feeMax).toBe(1000);
    expect(patch.confidence).toBeGreaterThanOrEqual(0.8);
  });
});

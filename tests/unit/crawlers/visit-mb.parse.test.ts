import { describe, it, expect } from "vitest";
import { parseVenue } from "../../../scripts/crawlers/visit-mb/parse";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("visit-mb parseVenue", () => {
  it("maps fields to normalized schema from fixture html", () => {
    const html = readFileSync(resolve(__dirname, "../../fixtures/html/visit-mb/venue1.html"), "utf8");
    const v = parseVenue(html);
    expect(v.name).toBe("LBTS Courts");
    expect(v.city).toBe("Pawleys Island");
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../../../app/api/search/programs/route";

process.env.TYPESENSE_SEARCH_KEY = "test-search-key";
process.env.TYPESENSE_HOST = "localhost";
process.env.TYPESENSE_PORT = "8108";
process.env.TYPESENSE_PROTOCOL = "http";

vi.mock("typesense", () => {
  return {
    default: {
      Client: vi.fn().mockImplementation(() => ({
        collections: vi.fn().mockReturnValue({
          documents: vi.fn().mockReturnValue({
            search: vi.fn().mockResolvedValue({
              hits: [
                {
                  document: {
                    id: "p_1",
                    venue_id: "v_1",
                    kind: "lesson",
                    level_min: 2.5,
                    level_max: 3.5,
                    start_ts: 1730793600,
                    price: 3500,
                  },
                },
                {
                  document: {
                    id: "p_2",
                    venue_id: "v_1",
                    kind: "clinic",
                    level_min: 3.5,
                    level_max: 4.5,
                    start_ts: 1730880000,
                    price: 4500,
                  },
                },
              ],
            }),
          }),
        }),
      })),
    },
  };
});

describe("/api/search/programs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns programs with default parameters", async () => {
    const url = new URL("http://localhost:3000/api/search/programs");
    const req = new NextRequest(url);

    const response = await GET(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.hits).toBeDefined();
    expect(Array.isArray(data.hits)).toBe(true);
  });

  it("filters by program kind", async () => {
    const url = new URL("http://localhost:3000/api/search/programs?kind=lesson");
    const req = new NextRequest(url);

    const response = await GET(req);
    expect(response.status).toBe(200);
  });

  it("filters by skill level", async () => {
    const url = new URL("http://localhost:3000/api/search/programs?level=3.0");
    const req = new NextRequest(url);

    const response = await GET(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    const doc = data.hits[0]?.document;
    if (doc) {
      expect(doc.level_min).toBeLessThanOrEqual(3.0);
      expect(doc.level_max).toBeGreaterThanOrEqual(3.0);
    }
  });

  it("validates skill level range", async () => {
    const url = new URL("http://localhost:3000/api/search/programs?level=10");
    const req = new NextRequest(url);

    const response = await GET(req);
    expect(response.status).toBe(400);
  });

  it("validates program kind enum", async () => {
    const url = new URL("http://localhost:3000/api/search/programs?kind=invalid");
    const req = new NextRequest(url);

    const response = await GET(req);
    expect(response.status).toBe(400);
  });

  it("accepts from date parameter", async () => {
    const url = new URL("http://localhost:3000/api/search/programs?from=2025-11-01");
    const req = new NextRequest(url);

    const response = await GET(req);
    expect(response.status).toBe(200);
  });

  it("filters out programs that don't match level", async () => {
    const url = new URL("http://localhost:3000/api/search/programs?level=2.0");
    const req = new NextRequest(url);

    const response = await GET(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    data.hits.forEach((hit: any) => {
      const doc = hit.document;
      expect(doc.level_min ?? 0).toBeLessThanOrEqual(2.0);
      expect(doc.level_max ?? 5.5).toBeGreaterThanOrEqual(2.0);
    });
  });

  it("handles edge case: level at lower bound", async () => {
    const url = new URL("http://localhost:3000/api/search/programs?level=2.5");
    const req = new NextRequest(url);

    const response = await GET(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    const matchingHit = data.hits.find((h: any) => h.document.level_min === 2.5);
    expect(matchingHit).toBeDefined();
  });

  it("handles edge case: level at upper bound", async () => {
    const url = new URL("http://localhost:3000/api/search/programs?level=3.5");
    const req = new NextRequest(url);

    const response = await GET(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    const matchingHit = data.hits.find((h: any) => h.document.level_max === 3.5);
    expect(matchingHit).toBeDefined();
  });
});

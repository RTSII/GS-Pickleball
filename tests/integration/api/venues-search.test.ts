import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../../../app/api/search/venues/route";

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
                    id: "v_1",
                    name: "Litchfield Pickleball",
                    city: "Pawleys Island",
                    indoor: false,
                    lights: true,
                    open_now: true,
                    _geo: [33.43, -79.12],
                    book_url: "https://example.com",
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

describe("/api/search/venues", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns venues with default parameters", async () => {
    const url = new URL("http://localhost:3000/api/search/venues?q=&lat=33.7&lng=-78.9");
    const req = new NextRequest(url);

    const response = await GET(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.hits).toBeDefined();
    expect(Array.isArray(data.hits)).toBe(true);
  });

  it("validates lat parameter", async () => {
    const url = new URL("http://localhost:3000/api/search/venues?lat=invalid&lng=-78.9");
    const req = new NextRequest(url);

    const response = await GET(req);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe("Invalid query");
  });

  it("validates lng parameter", async () => {
    const url = new URL("http://localhost:3000/api/search/venues?lat=33.7&lng=invalid");
    const req = new NextRequest(url);

    const response = await GET(req);
    expect(response.status).toBe(400);
  });

  it("accepts indoor filter", async () => {
    const url = new URL("http://localhost:3000/api/search/venues?indoor=true&lat=33.7&lng=-78.9");
    const req = new NextRequest(url);

    const response = await GET(req);
    expect(response.status).toBe(200);
  });

  it("accepts lights filter", async () => {
    const url = new URL("http://localhost:3000/api/search/venues?lights=true&lat=33.7&lng=-78.9");
    const req = new NextRequest(url);

    const response = await GET(req);
    expect(response.status).toBe(200);
  });

  it("accepts open filter", async () => {
    const url = new URL("http://localhost:3000/api/search/venues?open=true&lat=33.7&lng=-78.9");
    const req = new NextRequest(url);

    const response = await GET(req);
    expect(response.status).toBe(200);
  });

  it("rejects invalid filter values", async () => {
    const url = new URL("http://localhost:3000/api/search/venues?indoor=maybe&lat=33.7&lng=-78.9");
    const req = new NextRequest(url);

    const response = await GET(req);
    expect(response.status).toBe(400);
  });

  it("uses default coordinates when not provided", async () => {
    const url = new URL("http://localhost:3000/api/search/venues");
    const req = new NextRequest(url);

    const response = await GET(req);
    expect(response.status).toBe(200);
  });
});

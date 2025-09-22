"use client";

import { useEffect, useMemo, useState } from "react";

type VenueHit = {
  document: {
    id: string;
    name: string;
    city: string;
    indoor: boolean;
    lights: boolean;
    open_now: boolean;
    _geo: [number, number];
  };
};

export default function HomePage() {
  const [q, setQ] = useState("");
  const [lat, setLat] = useState(33.462);
  const [lng, setLng] = useState(-79.121);
  const [indoor, setIndoor] = useState<boolean | undefined>(undefined);
  const [lights, setLights] = useState<boolean | undefined>(undefined);
  const [open, setOpen] = useState<boolean | undefined>(undefined);
  const [hits, setHits] = useState<VenueHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(() => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (lat) sp.set("lat", String(lat));
    if (lng) sp.set("lng", String(lng));
    if (indoor !== undefined) sp.set("indoor", String(indoor));
    if (lights !== undefined) sp.set("lights", String(lights));
    if (open !== undefined) sp.set("open", String(open));
    return sp;
  }, [q, lat, lng, indoor, lights, open]);

  async function search() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search/venues?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      const data = await res.json();
      setHits(data.hits || []);
    } catch (e: any) {
      setError(e.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Do not auto-search on mount; requires Typesense env configuration.
  }, []);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search venues (name, city, tags)"
            style={{ padding: 8, minWidth: 280 }}
          />
          <label>
            Lat
            <input
              type="number"
              step="0.001"
              value={lat}
              onChange={(e) => setLat(Number(e.target.value))}
              style={{ marginLeft: 6, width: 120 }}
            />
          </label>
          <label>
            Lng
            <input
              type="number"
              step="0.001"
              value={lng}
              onChange={(e) => setLng(Number(e.target.value))}
              style={{ marginLeft: 6, width: 120 }}
            />
          </label>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <label>
            <input
              type="checkbox"
              checked={indoor === true}
              onChange={(e) => setIndoor(e.target.checked ? true : undefined)}
            />
            <span style={{ marginLeft: 6 }}>Indoor only</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={lights === true}
              onChange={(e) => setLights(e.target.checked ? true : undefined)}
            />
            <span style={{ marginLeft: 6 }}>Lights</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={open === true}
              onChange={(e) => setOpen(e.target.checked ? true : undefined)}
            />
            <span style={{ marginLeft: 6 }}>Open now</span>
          </label>
          <button onClick={search} disabled={loading} style={{ padding: "8px 12px" }}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        {error && (
          <div style={{ color: "#b91c1c" }}>Error: {error}</div>
        )}
      </section>

      <section>
        <h2 style={{ margin: "8px 0" }}>Results</h2>
        {hits.length === 0 && !loading && <div>No results.</div>}
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
          {hits.map((h) => (
            <li key={h.document.id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 600 }}>{h.document.name}</div>
              <div style={{ color: "#6b7280" }}>{h.document.city}</div>
              <div style={{ display: "flex", gap: 12, color: "#374151", fontSize: 14 }}>
                <span>{h.document.indoor ? "Indoor" : "Outdoor"}</span>
                <span>{h.document.lights ? "Lights" : "No lights"}</span>
                <span style={{ color: h.document.open_now ? "#065f46" : "#92400e" }}>
                  {h.document.open_now ? "Open now" : "Closed"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

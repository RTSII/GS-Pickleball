export type VenueRaw = {
  name?: string;
  address?: string;
  city?: string;
  fee_range?: string; // e.g., "$5-$10"
  hours?: any;
  sourceUrl?: string;
};

export type VenuePatch = {
  op: "upsert";
  entity: "Venue";
  after: {
    name: string;
    address?: string | null;
    city: string;
    feeMin?: number | null;
    feeMax?: number | null;
    hoursJson?: any;
    sourceUrl?: string | null;
  };
  confidence: number;
};

export function parseFeeRange(s?: string | null): { feeMin?: number; feeMax?: number } {
  if (!s) return {};
  const m = s.match(/\$?(\d+)(?:\s*-\s*\$?(\d+))?/);
  if (!m) return {};
  const a = Number(m[1]);
  const b = m[2] ? Number(m[2]) : a;
  return { feeMin: a * 100, feeMax: b * 100 };
}

export function normalizeVenue(raw: VenueRaw): VenuePatch {
  const name = (raw.name ?? "").trim();
  const city = (raw.city ?? "").trim();
  if (!name || !city) throw new Error("Missing required: name/city");
  const fees = parseFeeRange(raw.fee_range ?? undefined);
  const patch: VenuePatch = {
    op: "upsert",
    entity: "Venue",
    after: {
      name,
      address: raw.address ?? null,
      city,
      ...fees,
      hoursJson: raw.hours ?? null,
      sourceUrl: raw.sourceUrl ?? null,
    },
    confidence: 0.9,
  };
  return patch;
}

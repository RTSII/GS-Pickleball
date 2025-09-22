/*
  Test fixture builders for deterministic, easy-to-read test data.
  Usage examples:

    import { buildVenue, buildProgram, buildOvernightHours } from "../fixtures/builders";

    const venue = buildVenue({ city: "Pawleys Island", indoor: false });
    const hours = buildOvernightHours({ day: "fri", start: "22:00", end: "02:00" });
    const program = buildProgram({ venueId: venue.id, kind: "lesson", skillMin: 3.0, skillMax: 3.5 });

  All IDs are deterministic within a single test run (simple counters); avoid randomness
  to keep tests stable. Builders return plain objects you can pass to APIs or mappers.
*/

import type { ProgramKind } from "@prisma/client";

// ------------------------------
// Common helpers
// ------------------------------
const counters: Record<string, number> = Object.create(null);
function nextId(prefix: string) {
  counters[prefix] = (counters[prefix] ?? 0) + 1;
  return `${prefix}_${counters[prefix]}`;
}

export type DayKey = "sun"|"mon"|"tue"|"wed"|"thu"|"fri"|"sat";

export type HoursMap = {
  tz?: string;
  sun?: [string, string][];
  mon?: [string, string][];
  tue?: [string, string][];
  wed?: [string, string][];
  thu?: [string, string][];
  fri?: [string, string][];
  sat?: [string, string][];
} & Record<string, unknown>;

export function buildHours(opts?: { tz?: string; day?: DayKey; open?: string; close?: string }): HoursMap {
  const tz = opts?.tz ?? "America/New_York";
  const day = (opts?.day ?? "mon") as DayKey;
  const open = opts?.open ?? "09:00";
  const close = opts?.close ?? "17:00";
  return { tz, [day]: [[open, close]] } as HoursMap;
}

export function buildOvernightHours(opts?: { tz?: string; day?: DayKey; start?: string; end?: string }): HoursMap {
  const tz = opts?.tz ?? "America/New_York";
  const day = (opts?.day ?? "fri") as DayKey;
  const start = opts?.start ?? "22:00";
  const end = opts?.end ?? "02:00";
  return { tz, [day]: [[start, end]] } as HoursMap;
}

export function addRange(hours: HoursMap, day: DayKey, open: string, close: string): HoursMap {
  const arr = (hours[day] as [string, string][]) ?? [];
  return { ...hours, [day]: [...arr, [open, close]] } as HoursMap;
}

// ------------------------------
// Venue
// ------------------------------
export type VenueInput = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip?: string | null;
  lat: number;
  lng: number;
  indoor: boolean;
  lights: boolean;
  feeMin?: number | null;
  feeMax?: number | null;
  bookUrl?: string | null;
  hoursJson?: HoursMap | null;
  phone?: string | null;
  email?: string | null;
  site?: string | null;
  sourceUrl?: string | null;
  tags: string[];
};

export function buildVenue(overrides: Partial<VenueInput> = {}): VenueInput {
  const base: VenueInput = {
    id: nextId("v"),
    name: "Test Venue",
    address: "123 Main St",
    city: "Myrtle Beach",
    state: "SC",
    lat: 33.6891,
    lng: -78.8867,
    indoor: false,
    lights: true,
    feeMin: null,
    feeMax: null,
    bookUrl: null,
    hoursJson: buildHours({ day: "mon", open: "09:00", close: "17:00" }),
    phone: null,
    email: null,
    site: null,
    sourceUrl: null,
    tags: [],
  };
  return { ...base, ...overrides };
}

// ------------------------------
// Program
// ------------------------------
export type ProgramInput = {
  id: string;
  venueId: string;
  kind: ProgramKind | keyof typeof ProgramKind | "lesson"|"clinic"|"league"|"ladder"|"tournament";
  skillMin?: number | null;
  skillMax?: number | null;
  startTs?: Date | null;
  endTs?: Date | null;
  price?: number | null;
  signupUrl?: string | null;
};

export function buildProgram(overrides: Partial<ProgramInput> = {}): ProgramInput {
  const base: ProgramInput = {
    id: nextId("p"),
    venueId: overrides.venueId ?? nextId("v"),
    kind: (overrides.kind ?? "lesson") as any,
    skillMin: 3.0,
    skillMax: 3.5,
    startTs: new Date(Date.now() + 24 * 60 * 60 * 1000),
    endTs: null,
    price: 5000,
    signupUrl: "https://example.com/signup",
  };
  return { ...base, ...overrides };
}

// ------------------------------
// Coach (lightweight)
// ------------------------------
export type CoachInput = {
  id: string;
  name: string;
  creds?: string | null;
  rateHour?: number | null;
  ratingAvg?: number | null;
  cities?: string[];
};

export function buildCoach(overrides: Partial<CoachInput> = {}): CoachInput {
  const base: CoachInput = {
    id: nextId("c"),
    name: "Test Coach",
    creds: "USAPA Certified",
    rateHour: 6000,
    ratingAvg: 4.7,
    cities: ["Pawleys Island"],
  };
  return { ...base, ...overrides };
}

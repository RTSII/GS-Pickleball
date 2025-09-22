import { NextRequest, NextResponse } from "next/server";
import Typesense from "typesense";
import { z } from "zod";

function getClient() {
  const apiKey =
    process.env.TYPESENSE_SEARCH_KEY || process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing TYPESENSE_SEARCH_KEY (or NEXT_PUBLIC_TYPESENSE_SEARCH_KEY) env var",
    );
  }
  return new Typesense.Client({
    nodes: [
      {
        host: process.env.TYPESENSE_HOST!,
        port: Number(process.env.TYPESENSE_PORT || 443),
        protocol: process.env.TYPESENSE_PROTOCOL || "https",
      },
    ],
    apiKey,
  });
}

const QuerySchema = z.object({
  q: z.string().optional().default(""),
  lat: z.coerce.number().min(-90).max(90).default(33.462),
  lng: z.coerce.number().min(-180).max(180).default(-79.121),
  indoor: z.enum(["true", "false"]).optional(),
  lights: z.enum(["true", "false"]).optional(),
  open: z.enum(["true", "false"]).optional(),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { q, lat, lng, indoor, lights, open } = parsed.data;

  const filters: string[] = [];
  if (indoor) filters.push(`indoor:=${indoor}`);
  if (lights) filters.push(`lights:=${lights}`);
  if (open) filters.push(`open_now:=${open}`);
  const filter_by = filters.join(" && ");

  const client = getClient();
  const res = await client.collections("venues").documents().search({
    q,
    query_by: "name,city,tags",
    per_page: 50,
    filter_by,
    sort_by: `distance(_geo, ${lat}, ${lng}):asc`,
  } as any);

  return NextResponse.json(res);
}

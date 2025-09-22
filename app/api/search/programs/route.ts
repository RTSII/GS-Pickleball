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
  kind: z
    .enum(["lesson", "clinic", "league", "ladder", "tournament"]) // optional filter
    .optional(),
  level: z.coerce.number().min(0).max(5.5).optional(),
  from: z.string().datetime({ offset: true }).optional().or(z.string().date().optional()),
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
  const { q, kind, level, from } = parsed.data;
  const unixFrom = from ? Math.floor(new Date(from).getTime() / 1000) : 0;

  const filters: string[] = [];
  if (kind) filters.push(`kind:=${kind}`);
  if (unixFrom) filters.push(`start_ts:>=${unixFrom}`);
  const filter_by = filters.join(" && ");

  const client = getClient();
  const res = await client.collections("programs").documents().search({
    q,
    query_by: "kind",
    per_page: 50,
    filter_by,
    sort_by: `start_ts:asc`,
  } as any);

  const hits = (res.hits || []).filter((h: any) => {
    const d = h.document;
    if (!level) return true;
    return (d.level_min ?? 0) <= level && (d.level_max ?? 5.5) >= level;
  });

  return NextResponse.json({ ...res, hits });
}

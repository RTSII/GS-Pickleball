import "dotenv/config";
import Typesense from "typesense";
import { PrismaClient } from "@prisma/client";
import { isOpenNow } from "../lib/openNow";

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

const prisma = new PrismaClient();
const client = new Typesense.Client({
  nodes:[{host:requireEnv("TYPESENSE_HOST"), port:Number(process.env.TYPESENSE_PORT||443), protocol:process.env.TYPESENSE_PROTOCOL||"https"}],
  apiKey: requireEnv("TYPESENSE_ADMIN_KEY"),
});

const LOOKBACK_MINUTES = Number(process.env.LOOKBACK_MINUTES || 10);
const since = new Date(Date.now() - LOOKBACK_MINUTES*60*1000);

async function upsertVenues(){
  const rows = await prisma.venue.findMany({
    where:{ updatedAt:{ gt: since }},
    include:{ programs:true }
  });
  const docs = rows.map(v=>{
    const hasLessons = v.programs.some(p=>p.kind==="lesson"||p.kind==="clinic");
    return {
      id: v.id,
      name: v.name,
      city: v.city,
      tags: v.tags,
      indoor: v.indoor,
      lights: v.lights,
      fee_min: v.feeMin ?? 0,
      fee_max: v.feeMax ?? 0,
      has_lessons: hasLessons,
      open_now: v.hoursJson ? isOpenNow(v.hoursJson as any) : false,
      book_url: v.bookUrl ?? "",
      _geo: [v.lat, v.lng] as [number, number]
    };
  });
  if (docs.length) await client.collections("venues").documents().import(docs, {action:"upsert"} as any);
  console.log(`Upserted venues: ${docs.length}`);
}

async function upsertPrograms(){
  const rows = await prisma.program.findMany({ where:{ updatedAt:{ gt: since }}});
  const docs = rows.map(p=>({
    id: p.id,
    venue_id: p.venueId,
    kind: p.kind,
    level_min: p.skillMin ?? 0,
    level_max: p.skillMax ?? 0,
    price: p.price ?? 0,
    upcoming: p.startTs ? p.startTs > new Date() : false,
    start_ts: p.startTs ? Math.floor(p.startTs.getTime()/1000) : 0
  }));
  if (docs.length) await client.collections("programs").documents().import(docs, {action:"upsert"} as any);
  console.log(`Upserted programs: ${docs.length}`);
}

async function upsertCoaches(){
  const rows = await prisma.coach.findMany({ where:{ updatedAt:{ gt: since }}});
  const docs = rows.map(c=>({
    id: c.id, name: c.name, creds: c.creds ?? "",
    cities: c.cities, rate_hour: c.rateHour ?? 0, rating_avg: c.ratingAvg ?? 0
  }));
  if (docs.length) await client.collections("coaches").documents().import(docs, {action:"upsert"} as any);
  console.log(`Upserted coaches: ${docs.length}`);
}

async function main(){
  await upsertVenues();
  await upsertPrograms();
  await upsertCoaches();
  await prisma.$disconnect();
}

main().catch(async (e)=>{ console.error(e); await prisma.$disconnect(); process.exit(1); });

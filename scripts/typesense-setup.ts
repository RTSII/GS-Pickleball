import "dotenv/config";
import Typesense from "typesense";

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

const client = new Typesense.Client({
  nodes:[{host:process.env.TYPESENSE_HOST!, port:Number(process.env.TYPESENSE_PORT||443), protocol:process.env.TYPESENSE_PROTOCOL||"https"}],
  apiKey: requireEnv("TYPESENSE_ADMIN_KEY"),
  connectionTimeoutSeconds: 8
});

async function ensureCollection(schema: any){
  try {
    await client.collections(schema.name).retrieve();
  } catch {
    await client.collections().create(schema);
  }
}

async function main(){
  const schemas = [
    {
      name:"venues",
      fields:[
        {name:"id", type:"string"},
        {name:"name", type:"string"},
        {name:"city", type:"string", facet:true},
        {name:"tags", type:"string[]", facet:true},
        {name:"indoor", type:"bool", facet:true},
        {name:"lights", type:"bool", facet:true},
        {name:"fee_min", type:"int32", facet:true},
        {name:"fee_max", type:"int32", facet:true},
        {name:"has_lessons", type:"bool", facet:true},
        {name:"open_now", type:"bool", facet:true},
        {name:"book_url", type:"string"},
        {name:"_geo", type:"geopoint"}
      ],
      default_sorting_field: "fee_min"
    },
    {
      name:"programs",
      fields:[
        {name:"id", type:"string"},
        {name:"venue_id", type:"string", facet:true},
        {name:"kind", type:"string", facet:true},
        {name:"level_min", type:"float"},
        {name:"level_max", type:"float"},
        {name:"price", type:"int32"},
        {name:"upcoming", type:"bool", facet:true},
        {name:"start_ts", type:"int64", facet:true}
      ],
      default_sorting_field: "start_ts"
    },
    {
      name:"coaches",
      fields:[
        {name:"id", type:"string"},
        {name:"name", type:"string"},
        {name:"creds", type:"string"},
        {name:"cities", type:"string[]", facet:true},
        {name:"rate_hour", type:"int32"},
        {name:"rating_avg", type:"float"}
      ],
      default_sorting_field: "rate_hour"
    }
  ];

  for (const s of schemas) await ensureCollection(s as any);
  console.log("Typesense collections ready.");
}

main().catch(e=>{ console.error(e); process.exit(1); });

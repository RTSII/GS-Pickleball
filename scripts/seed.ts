import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  await prisma.venue.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.coach.deleteMany({});
  console.log("🧹 Cleared existing data");

  const venues = await prisma.venue.createMany({
    data: [
      {
        name: "Litchfield Beach & Tennis",
        address: "14276 Ocean Hwy",
        city: "Pawleys Island",
        state: "SC",
        zip: "29585",
        lat: 33.4341,
        lng: -79.1192,
        indoor: false,
        lights: true,
        feeMin: 0,
        feeMax: 1500,
        bookUrl: "https://www.litchfieldbythesea.com",
        hoursJson: {
          tz: "America/New_York",
          mon: [["07:00", "21:00"]],
          tue: [["07:00", "21:00"]],
          wed: [["07:00", "21:00"]],
          thu: [["07:00", "21:00"]],
          fri: [["07:00", "21:00"]],
          sat: [["08:00", "20:00"]],
          sun: [["08:00", "20:00"]],
        },
        phone: "(843) 237-3000",
        email: "info@litchfieldbythesea.com",
        site: "https://www.litchfieldbythesea.com",
        tags: ["tennis", "pickleball", "resort"],
      },
      {
        name: "Litchfield Pickleball",
        address: "97 Hawthorn Dr",
        city: "Pawleys Island",
        state: "SC",
        zip: "29585",
        lat: 33.4298,
        lng: -79.1145,
        indoor: false,
        lights: true,
        feeMin: 800,
        feeMax: 1200,
        bookUrl: "https://www.litchfieldpickle.com",
        hoursJson: {
          tz: "America/New_York",
          mon: [["08:00", "20:00"]],
          tue: [["08:00", "20:00"]],
          wed: [["08:00", "20:00"]],
          thu: [["08:00", "20:00"]],
          fri: [["08:00", "20:00"]],
          sat: [["09:00", "18:00"]],
          sun: [["09:00", "18:00"]],
        },
        phone: "(843) 314-9009",
        site: "https://www.litchfieldpickle.com",
        tags: ["pickleball", "dedicated", "lessons"],
      },
      {
        name: "Midway Park Pickleball Courts",
        address: "420 Waverly Ave",
        city: "Murrells Inlet",
        state: "SC",
        zip: "29576",
        lat: 33.5537,
        lng: -79.0451,
        indoor: false,
        lights: true,
        feeMin: 0,
        feeMax: 0,
        hoursJson: {
          tz: "America/New_York",
          mon: [["06:00", "22:00"]],
          tue: [["06:00", "22:00"]],
          wed: [["06:00", "22:00"]],
          thu: [["06:00", "22:00"]],
          fri: [["06:00", "22:00"]],
          sat: [["06:00", "22:00"]],
          sun: [["06:00", "22:00"]],
        },
        phone: "(843) 651-2220",
        tags: ["public", "free", "outdoor"],
      },
      {
        name: "Grande Dunes Tennis & Pickleball",
        address: "8005 Championship Dr",
        city: "Myrtle Beach",
        state: "SC",
        zip: "29579",
        lat: 33.7493,
        lng: -78.8172,
        indoor: false,
        lights: true,
        feeMin: 2000,
        feeMax: 4000,
        bookUrl: "https://www.grandedunes.com/amenities/tennis",
        hoursJson: {
          tz: "America/New_York",
          mon: [["07:00", "20:00"]],
          tue: [["07:00", "20:00"]],
          wed: [["07:00", "20:00"]],
          thu: [["07:00", "20:00"]],
          fri: [["07:00", "20:00"]],
          sat: [["08:00", "19:00"]],
          sun: [["08:00", "19:00"]],
        },
        phone: "(843) 449-7937",
        site: "https://www.grandedunes.com",
        tags: ["resort", "tennis", "pickleball", "lessons"],
      },
      {
        name: "Market Common District Park",
        address: "3305 Nevers St",
        city: "Myrtle Beach",
        state: "SC",
        zip: "29577",
        lat: 33.7236,
        lng: -78.8577,
        indoor: false,
        lights: true,
        feeMin: 0,
        feeMax: 0,
        hoursJson: {
          tz: "America/New_York",
          mon: [["06:00", "22:00"]],
          tue: [["06:00", "22:00"]],
          wed: [["06:00", "22:00"]],
          thu: [["06:00", "22:00"]],
          fri: [["06:00", "22:00"]],
          sat: [["06:00", "22:00"]],
          sun: [["06:00", "22:00"]],
        },
        tags: ["public", "free", "outdoor"],
      },
      {
        name: "Dink District Pickleball",
        address: "3791 Highway 501",
        city: "Myrtle Beach",
        state: "SC",
        zip: "29579",
        lat: 33.7182,
        lng: -79.0028,
        indoor: true,
        lights: true,
        feeMin: 1500,
        feeMax: 2500,
        bookUrl: "https://www.dinkdistrict.com",
        hoursJson: {
          tz: "America/New_York",
          mon: [["08:00", "22:00"]],
          tue: [["08:00", "22:00"]],
          wed: [["08:00", "22:00"]],
          thu: [["08:00", "22:00"]],
          fri: [["08:00", "23:00"]],
          sat: [["09:00", "23:00"]],
          sun: [["09:00", "21:00"]],
        },
        phone: "(843) 555-3465",
        site: "https://www.dinkdistrict.com",
        tags: ["indoor", "climate-controlled", "tournaments", "leagues"],
      },
      {
        name: "J. Bryan Floyd Park",
        address: "2000 Main St",
        city: "North Myrtle Beach",
        state: "SC",
        zip: "29582",
        lat: 33.8158,
        lng: -78.6803,
        indoor: false,
        lights: true,
        feeMin: 0,
        feeMax: 0,
        hoursJson: {
          tz: "America/New_York",
          mon: [["06:00", "22:00"]],
          tue: [["06:00", "22:00"]],
          wed: [["06:00", "22:00"]],
          thu: [["06:00", "22:00"]],
          fri: [["06:00", "22:00"]],
          sat: [["06:00", "22:00"]],
          sun: [["06:00", "22:00"]],
        },
        phone: "(843) 280-5570",
        tags: ["public", "free", "outdoor"],
      },
      {
        name: "Barefoot Resort Pickleball",
        address: "4980 Barefoot Resort Bridge Rd",
        city: "North Myrtle Beach",
        state: "SC",
        zip: "29582",
        lat: 33.8446,
        lng: -78.6491,
        indoor: false,
        lights: true,
        feeMin: 1500,
        feeMax: 3000,
        bookUrl: "https://www.barefootgolf.com",
        hoursJson: {
          tz: "America/New_York",
          mon: [["07:00", "21:00"]],
          tue: [["07:00", "21:00"]],
          wed: [["07:00", "21:00"]],
          thu: [["07:00", "21:00"]],
          fri: [["07:00", "22:00"]],
          sat: [["08:00", "22:00"]],
          sun: [["08:00", "21:00"]],
        },
        phone: "(843) 390-3200",
        site: "https://www.barefootgolf.com",
        tags: ["resort", "tennis", "pickleball"],
      },
      {
        name: "The PicklePort Indoor Complex",
        address: "2350 Dick Pond Rd",
        city: "Myrtle Beach",
        state: "SC",
        zip: "29577",
        lat: 33.7405,
        lng: -78.9124,
        indoor: true,
        lights: true,
        feeMin: 2000,
        feeMax: 3500,
        hoursJson: {
          tz: "America/New_York",
          mon: [["07:00", "23:00"]],
          tue: [["07:00", "23:00"]],
          wed: [["07:00", "23:00"]],
          thu: [["07:00", "23:00"]],
          fri: [["07:00", "00:30"]],
          sat: [["08:00", "00:30"]],
          sun: [["08:00", "22:00"]],
        },
        phone: "(843) 555-7678",
        tags: ["indoor", "climate-controlled", "food", "bar"],
      },
      {
        name: "Carolina Forest Community Park",
        address: "1015 River Oaks Dr",
        city: "Myrtle Beach",
        state: "SC",
        zip: "29579",
        lat: 33.7092,
        lng: -79.0156,
        indoor: false,
        lights: false,
        feeMin: 0,
        feeMax: 0,
        hoursJson: {
          tz: "America/New_York",
          mon: [["07:00", "20:00"]],
          tue: [["07:00", "20:00"]],
          wed: [["07:00", "20:00"]],
          thu: [["07:00", "20:00"]],
          fri: [["07:00", "20:00"]],
          sat: [["08:00", "20:00"]],
          sun: [["08:00", "20:00"]],
        },
        tags: ["public", "free", "outdoor", "no-lights"],
      },
    ],
  });

  console.log(`✅ Created ${venues.count} venues`);

  const allVenues = await prisma.venue.findMany();
  const litchfieldPickle = allVenues.find((v) => v.name === "Litchfield Pickleball");
  const dinkDistrict = allVenues.find((v) => v.name === "Dink District Pickleball");
  const grandeDunes = allVenues.find((v) => v.name === "Grande Dunes Tennis & Pickleball");
  const barefootResort = allVenues.find((v) => v.name === "Barefoot Resort Pickleball");

  const programs = await prisma.program.createMany({
    data: [
      {
        venueId: litchfieldPickle!.id,
        kind: "lesson",
        skillMin: 2.5,
        skillMax: 3.5,
        startTs: new Date("2025-11-05T09:00:00-05:00"),
        endTs: new Date("2025-11-05T11:00:00-05:00"),
        price: 3500,
        signupUrl: "https://www.litchfieldpickle.com/lessons",
      },
      {
        venueId: litchfieldPickle!.id,
        kind: "clinic",
        skillMin: 3.0,
        skillMax: 4.0,
        startTs: new Date("2025-11-08T14:00:00-05:00"),
        endTs: new Date("2025-11-08T16:00:00-05:00"),
        price: 4000,
        signupUrl: "https://www.litchfieldpickle.com/clinics",
      },
      {
        venueId: litchfieldPickle!.id,
        kind: "league",
        skillMin: 3.5,
        skillMax: 5.0,
        startTs: new Date("2025-11-12T18:00:00-05:00"),
        endTs: new Date("2025-12-17T20:00:00-05:00"),
        price: 7500,
        signupUrl: "https://www.litchfieldpickle.com/leagues",
      },
      {
        venueId: dinkDistrict!.id,
        kind: "lesson",
        skillMin: 2.0,
        skillMax: 3.0,
        startTs: new Date("2025-11-06T10:00:00-05:00"),
        endTs: new Date("2025-11-06T11:30:00-05:00"),
        price: 4000,
        signupUrl: "https://www.dinkdistrict.com/lessons",
      },
      {
        venueId: dinkDistrict!.id,
        kind: "tournament",
        skillMin: 3.0,
        skillMax: 5.0,
        startTs: new Date("2025-11-15T08:00:00-05:00"),
        endTs: new Date("2025-11-15T18:00:00-05:00"),
        price: 8500,
        signupUrl: "https://www.dinkdistrict.com/tournaments",
      },
      {
        venueId: grandeDunes!.id,
        kind: "lesson",
        skillMin: 2.5,
        skillMax: 3.5,
        startTs: new Date("2025-11-07T09:00:00-05:00"),
        endTs: new Date("2025-11-07T10:30:00-05:00"),
        price: 5000,
        signupUrl: "https://www.grandedunes.com/tennis",
      },
      {
        venueId: grandeDunes!.id,
        kind: "clinic",
        skillMin: 3.5,
        skillMax: 4.5,
        startTs: new Date("2025-11-10T14:00:00-05:00"),
        endTs: new Date("2025-11-10T16:00:00-05:00"),
        price: 6000,
        signupUrl: "https://www.grandedunes.com/tennis",
      },
      {
        venueId: barefootResort!.id,
        kind: "ladder",
        skillMin: 3.0,
        skillMax: 4.5,
        startTs: new Date("2025-11-11T17:00:00-05:00"),
        endTs: new Date("2025-12-16T19:00:00-05:00"),
        price: 6500,
        signupUrl: "https://www.barefootgolf.com/pickleball",
      },
    ],
  });

  console.log(`✅ Created ${programs.count} programs`);

  const coaches = await prisma.coach.createMany({
    data: [
      {
        name: "Sarah Mitchell",
        creds: "PPR Certified Professional, USAPA Ambassador",
        rateHour: 7500,
        ratingAvg: 4.8,
        cities: ["Pawleys Island", "Murrells Inlet", "Litchfield Beach"],
        contact: {
          email: "sarah.mitchell@example.com",
          phone: "(843) 555-1234",
        },
        site: "https://www.sarahmitchellpickleball.com",
      },
      {
        name: "Mike Chen",
        creds: "IPTPA Level 2, Former Division 1 Tennis",
        rateHour: 8500,
        ratingAvg: 4.9,
        cities: ["Myrtle Beach", "North Myrtle Beach", "Conway"],
        contact: {
          email: "coach.mike@example.com",
          phone: "(843) 555-5678",
        },
        site: "https://www.mikechenpickleball.com",
      },
      {
        name: "Jennifer Torres",
        creds: "PPR Certified, Sports Psychology MS",
        rateHour: 9000,
        ratingAvg: 5.0,
        cities: ["Myrtle Beach", "Pawleys Island", "Georgetown"],
        contact: {
          email: "jen.torres@example.com",
          phone: "(843) 555-9012",
        },
        site: "https://www.jennifertorrespb.com",
      },
    ],
  });

  console.log(`✅ Created ${coaches.count} coaches`);

  const totalVenues = await prisma.venue.count();
  const totalPrograms = await prisma.program.count();
  const totalCoaches = await prisma.coach.count();

  console.log("\n📊 Seed Summary:");
  console.log(`   Venues: ${totalVenues}`);
  console.log(`   Programs: ${totalPrograms}`);
  console.log(`   Coaches: ${totalCoaches}`);
  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

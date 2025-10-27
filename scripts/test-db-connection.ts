import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log("🔌 Testing database connection...");

    await prisma.$connect();
    console.log("✅ Database connection successful!");

    const venueCount = await prisma.venue.count();
    const programCount = await prisma.program.count();
    const coachCount = await prisma.coach.count();

    console.log("\n📊 Current database state:");
    console.log(`   Venues: ${venueCount}`);
    console.log(`   Programs: ${programCount}`);
    console.log(`   Coaches: ${coachCount}`);

    if (venueCount > 0 || programCount > 0 || coachCount > 0) {
      console.log("\n⚠️  Database already contains data.");
      console.log("   Running 'npm run seed' will clear and replace this data.");
    } else {
      console.log("\n✨ Database is empty and ready for seeding!");
    }

  } catch (error) {
    console.error("❌ Database connection failed:", error);
    console.error("\n💡 Troubleshooting:");
    console.error("   1. Check DATABASE_URL in .env file");
    console.error("   2. Verify Supabase project is active");
    console.error("   3. Ensure migrations are applied: npx prisma migrate deploy");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

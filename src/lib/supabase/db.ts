import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "postgres-migrate";
import postgres from "postgres";
import * as dotenv from "dotenv";
import * as schema from "./schema";
import { supabaseAdmin } from "./client";

dotenv.config({ path: ".env" });

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env file");
}

// Create a Postgres client
const client = postgres(process.env.DATABASE_URL, {
  max: 1,
  idle_timeout: 1000,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Initialize Drizzle with the client
export const db = drizzle(client, { schema });

// Run migrations function
const runMigrations = async () => {
  try {
    await migrate(db, { migrationsFolder: "migrations/" });
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Error running migrations:", error);
  }
};

// Only run migrations in development environment
if (process.env.NODE_ENV !== "production") {
  runMigrations();
}

// Supabase helper functions
export const getSession = async () => {
  const { data } = await supabaseAdmin.auth.getSession();
  return data.session;
};

export const getUserSubscriptionStatus = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select("*, prices(*, products(*))")
    .eq("user_id", userId)
    .in("status", ["trialing", "active"])
    .maybeSingle();

  if (error) {
    console.error("Error fetching subscription status:", error);
    return null;
  }

  return data;
};

export default db;

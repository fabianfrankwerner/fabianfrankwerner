require("dotenv").config();
const pool = require("../db");

(async () => {
  console.log(
    "Using DATABASE_URL from env:",
    process.env.DATABASE_URL || "(not set)"
  );

  try {
    const dbInfo = await pool.query(
      "SELECT current_database(), current_schema()"
    );
    console.log("Connected to DB:", dbInfo.rows[0].current_database);
    console.log("Schema:", dbInfo.rows[0].current_schema);

    const hasCategories = await pool.query(`
      SELECT to_regclass('public.categories') IS NOT NULL AS exists
    `);
    const hasItems = await pool.query(`
      SELECT to_regclass('public.items') IS NOT NULL AS exists
    `);

    console.log("categories table exists:", hasCategories.rows[0].exists);
    console.log("items table exists:", hasItems.rows[0].exists);
  } catch (e) {
    console.error("DB check failed ❌", e);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();

require("dotenv").config();
const pool = require("../db");

(async () => {
  try {
    const ver = await pool.query("SELECT version()");
    const now = await pool.query("SELECT NOW() AS now");
    console.log("Connected ✅");
    console.log("Postgres version:", ver.rows[0].version);
    console.log("Server time:", now.rows[0].now);

    // Optional: check tables if they exist
    const hasCategories = await pool.query(`
      SELECT to_regclass('public.categories') IS NOT NULL AS exists
    `);
    const hasItems = await pool.query(`
      SELECT to_regclass('public.items') IS NOT NULL AS exists
    `);
    console.log("categories table exists:", hasCategories.rows[0].exists);
    console.log("items table exists:", hasItems.rows[0].exists);

    // Optional: counts (safe to run even if empty)
    try {
      const cat = await pool.query(
        "SELECT COUNT(*)::int AS count FROM categories"
      );
      const itm = await pool.query("SELECT COUNT(*)::int AS count FROM items");
      console.log("categories count:", cat.rows[0].count);
      console.log("items count:", itm.rows[0].count);
    } catch {
      console.log("Counts unavailable (tables not created yet).");
    }
  } catch (e) {
    console.error("DB check failed ❌");
    console.error(e);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();

require("dotenv").config();
const pool = require("../db");

const createTables = async () => {
  try {
    console.log("Creating categories table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    console.log("Categories table created successfully");

    console.log("Creating items table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id BIGSERIAL PRIMARY KEY,
        category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        name VARCHAR(120) NOT NULL,
        description TEXT,
        price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
        image_url TEXT,
        stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_item_per_category UNIQUE (category_id, name)
      )
    `);
    console.log("Items table created successfully");

    console.log("Creating index...");
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id)
    `);
    console.log("Index created successfully");

    // Verify tables exist
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('categories', 'items')
    `);
    console.log(
      "Tables found:",
      tables.rows.map((row) => row.table_name)
    );
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    await pool.end();
  }
};

createTables();

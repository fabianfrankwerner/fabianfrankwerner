require("dotenv").config();
const pool = require("../db");

const seedData = async () => {
  try {
    console.log("Seeding categories...");

    // Insert categories
    const categoryResult = await pool.query(`
      INSERT INTO categories (name, description) VALUES
      ('Indoor Plants', 'Beautiful houseplants to brighten your home.'),
      ('Pots & Planters', 'Stylish pots and planters for your plants.'),
      ('Plant Care Tools', 'Everything you need to keep your plants healthy.'),
      ('Accessories', 'Stands, misters, and other plant accessories.')
      ON CONFLICT (name) DO NOTHING
      RETURNING id, name
    `);

    console.log("Categories inserted:", categoryResult.rows.length);

    // Get category IDs for items
    const categories = await pool.query("SELECT id, name FROM categories");
    const categoryMap = {};
    categories.rows.forEach((cat) => {
      categoryMap[cat.name] = cat.id;
    });

    console.log("Seeding items...");

    // Insert items
    const itemResult = await pool.query(
      `
      INSERT INTO items (category_id, name, description, price, image_url, stock_quantity) VALUES
      ($1, 'Monstera Deliciosa', 'Tropical plant with iconic split leaves.', 45.00, 'https://images.unsplash.com/photo-1609648756066-976f46028e6d?w=400', 12),
      ($1, 'Snake Plant', 'Low-maintenance plant perfect for beginners.', 25.00, 'https://images.unsplash.com/photo-1547516508-e910d368d995?w=400', 20),
      ($2, 'Ceramic Planter - White (20cm)', 'Minimalist ceramic pot for modern decor.', 15.00, 'https://images.unsplash.com/photo-1656414409557-0c510c360154?&w=400', 30),
      ($3, 'Pruning Shears', 'Stainless steel shears for clean cuts.', 12.50, 'https://plus.unsplash.com/premium_photo-1680322468906-d3ed1fb060d4?w=400', 15),
      ($4, 'Plant Mister (Glass)', 'Fine mist sprayer for humidity-loving plants.', 10.00, 'https://images.unsplash.com/photo-1610389473058-fd68ad1d8bac?w=400', 18)
      ON CONFLICT (category_id, name) DO NOTHING
    `,
      [
        categoryMap["Indoor Plants"],
        categoryMap["Pots & Planters"],
        categoryMap["Plant Care Tools"],
        categoryMap["Accessories"],
      ]
    );

    console.log("Items inserted successfully");

    // Verify data
    const finalCounts = await Promise.all([
      pool.query("SELECT COUNT(*) FROM categories"),
      pool.query("SELECT COUNT(*) FROM items"),
    ]);

    console.log("Final counts:");
    console.log("Categories:", finalCounts[0].rows[0].count);
    console.log("Items:", finalCounts[1].rows[0].count);

    // Show some sample data
    const sampleCategories = await pool.query(
      "SELECT * FROM categories LIMIT 3"
    );
    const sampleItems = await pool.query("SELECT * FROM items LIMIT 3");

    console.log("\nSample categories:", sampleCategories.rows);
    console.log("\nSample items:", sampleItems.rows);
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await pool.end();
  }
};

seedData();

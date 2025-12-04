const pool = require("../db");

// Display list of all items
const itemsListGet = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        i.id,
        i.name,
        i.description,
        i.price,
        i.stock_quantity,
        i.image_url,
        c.name as category_name,
        c.id as category_id
      FROM items i
      JOIN categories c ON i.category_id = c.id
      ORDER BY c.name, i.name
    `);

    res.render("items/index", {
      title: "All Items",
      items: result.rows,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load items",
    });
  }
};

// Display item create form on GET
const itemsCreateGet = async (req, res) => {
  try {
    const categoriesResult = await pool.query(
      "SELECT id, name FROM categories ORDER BY name"
    );

    res.render("items/form", {
      title: "Create Item",
      item: null,
      categories: categoriesResult.rows,
      errors: null,
    });
  } catch (error) {
    console.error("Error fetching categories for form:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load form data",
    });
  }
};

// Handle item create on POST
const itemsCreatePost = async (req, res) => {
  const { name, description, price, stock_quantity, image_url, category_id } =
    req.body;
  const errors = [];

  // Validation
  if (!name || name.trim().length === 0) {
    errors.push("Name is required");
  }
  if (name && name.length > 120) {
    errors.push("Name must be less than 120 characters");
  }
  if (!category_id) {
    errors.push("Category is required");
  }
  if (!price || isNaN(price) || parseFloat(price) < 0) {
    errors.push("Valid price is required");
  }
  if (
    !stock_quantity ||
    isNaN(stock_quantity) ||
    parseInt(stock_quantity) < 0
  ) {
    errors.push("Valid stock quantity is required");
  }

  if (errors.length > 0) {
    try {
      const categoriesResult = await pool.query(
        "SELECT id, name FROM categories ORDER BY name"
      );

      return res.render("items/form", {
        title: "Create Item",
        item: {
          name,
          description,
          price,
          stock_quantity,
          image_url,
          category_id,
        },
        categories: categoriesResult.rows,
        errors,
      });
    } catch (error) {
      return res.status(500).render("error", {
        title: "Error",
        message: "Failed to load form data",
      });
    }
  }

  try {
    const result = await pool.query(
      `INSERT INTO items (category_id, name, description, price, stock_quantity, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        category_id,
        name.trim(),
        description?.trim() || null,
        parseFloat(price),
        parseInt(stock_quantity),
        image_url?.trim() || null,
      ]
    );

    res.redirect(`/items/${result.rows[0].id}`);
  } catch (error) {
    if (error.code === "23505") {
      // Unique violation
      errors.push("An item with this name already exists in this category");
    } else if (error.code === "23503") {
      // Foreign key violation
      errors.push("Selected category does not exist");
    } else {
      errors.push("Failed to create item");
    }

    try {
      const categoriesResult = await pool.query(
        "SELECT id, name FROM categories ORDER BY name"
      );

      res.render("items/form", {
        title: "Create Item",
        item: {
          name,
          description,
          price,
          stock_quantity,
          image_url,
          category_id,
        },
        categories: categoriesResult.rows,
        errors,
      });
    } catch (dbError) {
      res.status(500).render("error", {
        title: "Error",
        message: "Failed to load form data",
      });
    }
  }
};

// Display detail page for a specific item
const itemDetailGet = async (req, res) => {
  try {
    const itemId = req.params.id;

    const result = await pool.query(
      `
      SELECT 
        i.*,
        c.name as category_name,
        c.id as category_id
      FROM items i
      JOIN categories c ON i.category_id = c.id
      WHERE i.id = $1
    `,
      [itemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Item not found",
      });
    }

    res.render("items/detail", {
      title: result.rows[0].name,
      item: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load item",
    });
  }
};

// Display item update form on GET
const itemsUpdateGet = async (req, res) => {
  try {
    const itemId = req.params.id;

    const [itemResult, categoriesResult] = await Promise.all([
      pool.query("SELECT * FROM items WHERE id = $1", [itemId]),
      pool.query("SELECT id, name FROM categories ORDER BY name"),
    ]);

    if (itemResult.rows.length === 0) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Item not found",
      });
    }

    res.render("items/form", {
      title: "Update Item",
      item: itemResult.rows[0],
      categories: categoriesResult.rows,
      errors: null,
    });
  } catch (error) {
    console.error("Error fetching item for update:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load item",
    });
  }
};

// Handle item update on POST
const itemsUpdatePost = async (req, res) => {
  const itemId = req.params.id;
  const { name, description, price, stock_quantity, image_url, category_id } =
    req.body;
  const errors = [];

  // Validation
  if (!name || name.trim().length === 0) {
    errors.push("Name is required");
  }
  if (name && name.length > 120) {
    errors.push("Name must be less than 120 characters");
  }
  if (!category_id) {
    errors.push("Category is required");
  }
  if (!price || isNaN(price) || parseFloat(price) < 0) {
    errors.push("Valid price is required");
  }
  if (
    !stock_quantity ||
    isNaN(stock_quantity) ||
    parseInt(stock_quantity) < 0
  ) {
    errors.push("Valid stock quantity is required");
  }

  if (errors.length > 0) {
    try {
      const categoriesResult = await pool.query(
        "SELECT id, name FROM categories ORDER BY name"
      );

      return res.render("items/form", {
        title: "Update Item",
        item: {
          id: itemId,
          name,
          description,
          price,
          stock_quantity,
          image_url,
          category_id,
        },
        categories: categoriesResult.rows,
        errors,
      });
    } catch (error) {
      return res.status(500).render("error", {
        title: "Error",
        message: "Failed to load form data",
      });
    }
  }

  try {
    const result = await pool.query(
      `UPDATE items 
       SET category_id = $1, name = $2, description = $3, price = $4, 
           stock_quantity = $5, image_url = $6, updated_at = NOW() 
       WHERE id = $7 RETURNING *`,
      [
        category_id,
        name.trim(),
        description?.trim() || null,
        parseFloat(price),
        parseInt(stock_quantity),
        image_url?.trim() || null,
        itemId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Item not found",
      });
    }

    res.redirect(`/items/${itemId}`);
  } catch (error) {
    if (error.code === "23505") {
      // Unique violation
      errors.push("An item with this name already exists in this category");
    } else if (error.code === "23503") {
      // Foreign key violation
      errors.push("Selected category does not exist");
    } else {
      errors.push("Failed to update item");
    }

    try {
      const categoriesResult = await pool.query(
        "SELECT id, name FROM categories ORDER BY name"
      );

      res.render("items/form", {
        title: "Update Item",
        item: {
          id: itemId,
          name,
          description,
          price,
          stock_quantity,
          image_url,
          category_id,
        },
        categories: categoriesResult.rows,
        errors,
      });
    } catch (dbError) {
      res.status(500).render("error", {
        title: "Error",
        message: "Failed to load form data",
      });
    }
  }
};

// Handle item delete on POST
const itemsDeletePost = async (req, res) => {
  try {
    const itemId = req.params.id;

    const result = await pool.query(
      "DELETE FROM items WHERE id = $1 RETURNING *",
      [itemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Item not found",
      });
    }

    res.redirect("/items");
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to delete item",
    });
  }
};

module.exports = {
  itemsListGet,
  itemsCreateGet,
  itemsCreatePost,
  itemDetailGet,
  itemsUpdateGet,
  itemsUpdatePost,
  itemsDeletePost,
};

const pool = require("../db");

// Display list of all categories
const categoriesListGet = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.description,
        COUNT(i.id) as item_count,
        c.created_at
      FROM categories c
      LEFT JOIN items i ON c.id = i.category_id
      GROUP BY c.id, c.name, c.description, c.created_at
      ORDER BY c.name
    `);

    res.render("categories/index", {
      title: "Categories",
      categories: result.rows,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load categories",
    });
  }
};

// Display category create form on GET
const categoriesCreateGet = (req, res) => {
  res.render("categories/form", {
    title: "Create Category",
    category: null,
    errors: null,
  });
};

// Handle category create on POST
const categoriesCreatePost = async (req, res) => {
  const { name, description } = req.body;
  const errors = [];

  // Validation
  if (!name || name.trim().length === 0) {
    errors.push("Name is required");
  }
  if (name && name.length > 100) {
    errors.push("Name must be less than 100 characters");
  }

  if (errors.length > 0) {
    return res.render("categories/form", {
      title: "Create Category",
      category: { name, description },
      errors,
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
      [name.trim(), description?.trim() || null]
    );

    res.redirect(`/categories/${result.rows[0].id}`);
  } catch (error) {
    if (error.code === "23505") {
      // Unique violation
      errors.push("A category with this name already exists");
    } else {
      errors.push("Failed to create category");
    }

    res.render("categories/form", {
      title: "Create Category",
      category: { name, description },
      errors,
    });
  }
};

// Display detail page for a specific category
const categoryDetailGet = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Get category details
    const categoryResult = await pool.query(
      "SELECT * FROM categories WHERE id = $1",
      [categoryId]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Category not found",
      });
    }

    const category = categoryResult.rows[0];

    // Get items in this category
    const itemsResult = await pool.query(
      "SELECT * FROM items WHERE category_id = $1 ORDER BY name",
      [categoryId]
    );

    res.render("categories/detail", {
      title: category.name,
      category,
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load category",
    });
  }
};

// Display category update form on GET
const categoriesUpdateGet = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const result = await pool.query("SELECT * FROM categories WHERE id = $1", [
      categoryId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Category not found",
      });
    }

    res.render("categories/form", {
      title: "Update Category",
      category: result.rows[0],
      errors: null,
    });
  } catch (error) {
    console.error("Error fetching category for update:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load category",
    });
  }
};

// Handle category update on POST
const categoriesUpdatePost = async (req, res) => {
  const categoryId = req.params.id;
  const { name, description } = req.body;
  const errors = [];

  // Validation
  if (!name || name.trim().length === 0) {
    errors.push("Name is required");
  }
  if (name && name.length > 100) {
    errors.push("Name must be less than 100 characters");
  }

  if (errors.length > 0) {
    return res.render("categories/form", {
      title: "Update Category",
      category: { id: categoryId, name, description },
      errors,
    });
  }

  try {
    const result = await pool.query(
      "UPDATE categories SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
      [name.trim(), description?.trim() || null, categoryId]
    );

    if (result.rows.length === 0) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Category not found",
      });
    }

    res.redirect(`/categories/${categoryId}`);
  } catch (error) {
    if (error.code === "23505") {
      // Unique violation
      errors.push("A category with this name already exists");
    } else {
      errors.push("Failed to update category");
    }

    res.render("categories/form", {
      title: "Update Category",
      category: { id: categoryId, name, description },
      errors,
    });
  }
};

// Handle category delete on POST
const categoriesDeletePost = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Check if category has items
    const itemsResult = await pool.query(
      "SELECT COUNT(*) FROM items WHERE category_id = $1",
      [categoryId]
    );

    const itemCount = parseInt(itemsResult.rows[0].count);

    if (itemCount > 0) {
      return res.status(400).render("error", {
        title: "Cannot Delete",
        message: `Cannot delete category with ${itemCount} item(s). Please delete or move the items first.`,
      });
    }

    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [categoryId]
    );

    if (result.rows.length === 0) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Category not found",
      });
    }

    res.redirect("/categories");
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to delete category",
    });
  }
};

module.exports = {
  categoriesListGet,
  categoriesCreateGet,
  categoriesCreatePost,
  categoryDetailGet,
  categoriesUpdateGet,
  categoriesUpdatePost,
  categoriesDeletePost,
};

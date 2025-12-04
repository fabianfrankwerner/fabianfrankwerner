CREATE TABLE "ingredients" (
    "id" INTEGER PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "price_per_unit" REAL NOT NULL
);

CREATE TABLE "donuts" (
    "id" INTEGER PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "gluten_free" INTEGER NOT NULL,
    "price" REAL NOT NULL
);

CREATE TABLE "donut_ingredients" (
    "donut_id" INTEGER,
    "ingredient_id" INTEGER,
    PRIMARY KEY ("donut_id", "ingredient_id"),
    FOREIGN KEY ("donut_id") REFERENCES "donuts"("id"),
    FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id")
);

CREATE TABLE "customers" (
    "id" INTEGER PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL
);

CREATE TABLE "orders" (
    "id" INTEGER PRIMARY KEY,
    "customer_id" INTEGER,
    "order_date" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("customer_id") REFERENCES "customers"("id")
);

CREATE TABLE "order_details" (
    "order_id" INTEGER,
    "donut_id" INTEGER,
    "quantity" INTEGER NOT NULL CHECK("quantity" > 0),
    PRIMARY KEY ("order_id", "donut_id"),
    FOREIGN KEY ("order_id") REFERENCES "orders"("id"),
    FOREIGN KEY ("donut_id") REFERENCES "donuts"("id")
);

-- Drop and recreate Widgets table (Example)

DROP TABLE IF EXISTS menu_items CASCADE;
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY NOT NULL,
  dish VARCHAR(255) NOT NULL,
  description TEXT,
  dish_image_url VARCHAR(255) NOT NULL,
  thumbnail_image_url VARCHAR(255) NOT NULL,
  price INTEGER  NOT NULL DEFAULT 0
);

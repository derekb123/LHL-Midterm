DROP TABLE IF EXISTS ordered_items CASCADE;
CREATE TABLE ordered_items (
  id SERIAL PRIMARY KEY NOT NULL,
  order_id INTEGER REFERENCES orders(id),
  menu_item_id INTEGER REFERENCES menu_items(id),
  qty INTEGER NOT NULL DEFAULT 0
);

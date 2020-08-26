DROP TABLE IF EXISTS ordered_items CASCADE;
CREATE TABLE ordered_items (
  order_id INTEGER REFERENCES orders(id) NOT NULL,
  menu_item_id INTEGER REFERENCES menu_items(id) NOT NULL,
  qty INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (order_id, menu_item_id),
  CONSTRAINT ordered_items_unique UNIQUE(order_id, menu_item_id)
);

DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id),
  place_at TIMESTAMP NOT NULL,
  wait_time INTEGER NOT NULL,
  order_status BOOLEAN DEFAULT TRUE,
  special_instructure text
);

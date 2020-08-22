DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id),
  special_instructure text,
  place_at TIMESTAMP NOT NULL,
  order_status BOOLEAN DEFAULT FALSE
);

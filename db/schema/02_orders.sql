DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id),
  special_instruction text,
  place_at TIMESTAMP,
  order_status  VARCHAR(255) NOT NULL
);

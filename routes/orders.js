/* All routes for orders are defined here
 * Since this file is loaded in server.js into api/orders,
 * these routes are mounted onto /orders
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const sendSms = require('../public/scripts/twilio');
const cookieSession = require('cookie-session');

module.exports = (db) => {

//For orders. The "cart" is an order with order_status: pending.
//General route to adjust order_items quantity in database. Request to define qty.



// Upser (update and insert) oder item id
const createNewOrderItem = (order_id, menu_item_id, qty)  => {
  let newOrderItemQuery = `
    INSERT INTO ordered_items (order_id, menu_item_id, qty)
    VALUES ($1, $2, $3)
    ON CONFLICT
    ON CONSTRAINT ordered_items_unique
    DO
      UPDATE
      SET qty = $3 + (SELECT qty from ordered_items WHERE ordered_items.order_id = $1 AND ordered_items.menu_item_id = $2)
      WHERE ordered_items.order_id = $1 AND
      ordered_items.menu_item_id = $2
    RETURNING *;
    `;
    return db.query(newOrderItemQuery, [order_id, menu_item_id, qty])
      .then(data => {
        console.log('end of create new order item');
        return order_id;
      })
};

const deleteOrderItem = (order_id, menu_item_id)  => {
  let deleteOrderItemQuery = `
      DELETE FROM ordered_items
      WHERE order_id = $1 AND
      menu_item_id = $2;
      `;
    return db.query(deleteOrderItemQuery, [order_id, menu_item_id])
      .then(data => {
        return order_id;
      })
};

/*Upon first menu item 'added' to cart: First: Creates new order,
Then: calls createNewOrderItem to create the menu item that was submitted*/
const createNewOrder = (user_id, menu_item_id, qty) => {
  let createOrderQuery = `
  INSERT INTO orders (user_id, order_status)
  VALUES ($1, 'PENDING')
  RETURNING *;
  `;
  return db.query(createOrderQuery, [user_id])
    .then(data => {
      const newOrder = data.rows[0];
      return newOrder;
    })
    .then(newOrder => {
      console.log('end of create new order');
      return createNewOrderItem(newOrder.id, menu_item_id, qty)
    })
};

//Conditional paths to execute correct functions
//Updates the database
//Sends back updated object to re-render cart
router.post("/:order_id?", (req, res) => {
  let promise = Promise.resolve()
  const {order_id} = req.params;
  const {qty, menu_item_id} = req.body;
  console.log(req.body);
  if (order_id) {
    if (qty) {
      console.log('create new order item');
      promise = createNewOrderItem(order_id, menu_item_id, qty)
    }
    else {
      console.log('route to delete order item')
      promise = deleteOrderItem(order_id, menu_item_id);
    }
  } else{
    console.log('create order');
    promise = createNewOrder(/*req.session.user_id*/ 1, menu_item_id, req.body.qty);
  }
  promise.then(orderID => {
    return db.query(`SELECT ordered_items.*, menu_items.*
    FROM ordered_items
    JOIN menu_items
    ON menu_item_id = menu_items.id
    WHERE order_id = $1;`, [orderID])
    .then(data => {
      console.log('end of route');
      const order = data.rows;
      res.send(order);
      })
    .catch(err => {
      console.error(err);
      res
        .status(500)
        .json({ error: err.message });
    });
  });
});

router.post("/:order_id/submit/", (req, res) => {
  const query = `
    UPDATE orders
    SET order_status = $1
    WHERE orders.id = $2;
    `;
  const userId = req.session.user_id;

  db.query(query, ['complete', userId])
    .then(() => {
      const query = `
        SELECT users.phone, users.name FROM users
        JOIN orders ON user_id = users.id
        WHERE orders.id = $1;
      `;

      db.query(query, [userId])
      .then((data) => {
        const phoneNumber = data.rows[0].phone;
        const name = data.rows[0].name;
        const customerMsg = `Hi ${name}! Thanks for ordering with RestO. Your estimated order time is 20 minutes. Payment is due upon pick-up`;
        const restaurantMsg = "You have an new order!";

        sendSms(phoneNumber, customerMsg);
        sendSms('+17786289669',restaurantMsg); //We need to know who will be the restaurant in the presentation, and input number here
        console.log('made it to line 146');
        res
          .status(200)
          .send("Success");
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err });
      })
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err });
    });
});

  return router;
};



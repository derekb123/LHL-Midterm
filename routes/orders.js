/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

//For orders. The "cart" is an order with order_status: pending.

  //General route to adjust order_items quantity in database. AJAX request to define qty.


  const db = require("../w4/tweeter/server/lib/in-memory-db");

const updateOrderItem = (order_id, menu_item_id, qty) => {
  let updateOrderQuery = `
  UPDATE ordered_items
  SET qty = $3
  WHERE order_id = $1 AND
  menu_item_id = $2;
  `;
  return db.query(updateOrderQuery, [order_id, menu_item_id, qty])
    .then(data => {
      return {message: 'updated order'};
    })
};

const createNewOrderItem = (order_id, menu_item_id)  => {
  let newOrderItemQuery = `
    INSERT INTO ordered_items (order_id, menu_item_id, qty)
    ($1, $2, $3)
    RETURNING *;
    `;
    return db.query(newOrderItemQuery, [order_id, menu_item_id, 1])
      .then(data => {
        const newOrderItem = data.rows[0];
        return newOrderItem;
      })
};

const createNewOrder = (user_id, menu_item_id) => {
  let createOrderQuery = `
  INSERT INTO orders (user_id, order_status)
  ($1, 'PENDING')
  RETURNING *;
  `;
  return db.query(createOrderQuery, [user_id])
    .then(data => {
      const newOrder = data.rows[0];
      return newOrder;
    })
    .then(newOrder => {
      return createNewOrderItem(newOrder.id, menu_item_id)
    })
    .then(data => {
      return {message: 'created cart'}
    })
};


router.post("/:order_id/menu_items/:menu_item_id", (req, res) => {
  // console.log('orders/id: works!');
  let promise = Promise.resolve()
  const {order_id, menu_item_id} = req.params;
  const {qty} = req.body;
  if (order_id) {
    if (req.body.qty === undefined) {
      promise = createNewOrderItem(order_id, menu_item_id)
    }
    else if (qty < 1) {
      // promise = deleteOrderItem(order_id, menu_item_id);
    }
    else{
      promise = updateOrderItem(order_id, menu_item_id, req.body.qty)
    }
  } else{
    promise = createNewOrder(user_id, menu_item_id, {qty: req.body.qty});
  }
  promise.then(data => {
    res.send(data.message);
      })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});




  router.post("/orders/:ordered_item_id/delete", (req, res) => {
    console.log('orders/id: works!');
    let query = `
      DELETE FROM ordered_items
      WHERE ordered_items.id = $1;
      `;
    db.query(query, [req.params.ordered_item_id])
      .then(data => {
        const items = data.rows;
        res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/orders/:id", (req, res) => {
    console.log(' works!');
    let query = `
      UPDATE orders (order_status)
      VALUES ($1)
      `;
    db.query(query, 'complete')
      .then(data => {
        const items = data.rows;
        res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};



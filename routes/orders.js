/*
 * All routes for orders are defined here
 * Since this file is loaded in server.js into api/orders,
 *   these routes are mounted onto /orders
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

//For orders. The "cart" is an order with order_status: pending.

//General route to adjust order_items quantity in database. AJAX request to define qty.



// UPSERT UPDATE AND INSERT ORDER ITEM ID
const createNewOrderItem = (order_id, menu_item_id, qty)  => {
  let newOrderItemQuery = `
    INSERT INTO ordered_items (order_id, menu_item_id, qty)
    VALUES ($1, $2, $3)
    ON CONFLICT
    ON CONSTRAINT ordered_items_unique
    DO
      UPDATE
      SET qty = $3
      WHERE ordered_items.order_id = $1 AND
      ordered_items.menu_item_id = $2
    RETURNING *;
    `;
    return db.query(newOrderItemQuery, [order_id, menu_item_id, qty])
      .then(data => {
        console.log('end of create new order item');
        // const newOrderItem = data.rows[0];
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
    // .then(data => {
    //   return {message: 'created cart and added order item'}
    // })
};



router.post("/:order_id?", (req, res) => {
  let promise = Promise.resolve()
  const {order_id} = req.params;
  const {qty, menu_item_id} = req.body;
  console.log(req.body);
  if (order_id/*.status === 'PENDING'*/) {
    if (qty) {
      console.log('create new order item');
      promise = createNewOrderItem(order_id, menu_item_id, qty)
    }
    else {
      console.log('route to delete order item')
      promise = deleteOrderItem(order_id, menu_item_id);
    }
    // else if (req.body.qty > 0) {
    //   console.log('update order item');
    //   promise = updateOrderItem(order_id, menu_item_id, req.body.qty)
    // }
  } else{
    console.log('create order');
    promise = createNewOrder(/*req.session.user_id*/ 1, menu_item_id, req.body.qty);
  }
  promise.then(orderID => {
    //return db.query('SELECT * FROM orders where orders.id = $1;', [orderID])
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


  // router.post("/orders/:id/submit", (req, res) => {
  //   console.log(' works!');
  //   let query = `
  //     UPDATE orders (order_status)
  //     VALUES ($1)
  //     WHERE orders.id = $2;
  //     `;
  //   db.query(query, ['complete', req.params.id])
  //     .then(data => {
  //       const items = data.rows;
  //       res.json({ items });
  //     })
  //     .catch(err => {
  //       res
  //         .status(500)
  //         .json({ error: err.message });
  //     });
  // });

  return router;
};



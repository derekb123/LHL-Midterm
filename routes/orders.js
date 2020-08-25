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


  router.post("/:order_id/menu_items/:menu_item_id", (req, res) => {
    console.log('orders/id: works!');
    let query = `
      UPDATE ordered_items
      SET qty = $3
      WHERE order_id = $1 AND
      menu_item_id = $2;
      `;
    db.query(query, [req.params.order_id, req.params.menu_item_id, req.body.qty])
      .then(data => {
        res.send('successful order update');
        //Use below if you want to recieve the updated row data via .json
      //})
      // .then(data => {
      //   const items = data.rows;
      //   res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });



  router.post("/:order_id/menu_items/:menu_item_id", (req, res) => {
    console.log('orders/id: works!');
    let query1 = `
      SELECT menu_item_id
      FROM ordered_items
      WHERE menu_item_id = $1;
    `
    let query2 = `
      UPDATE ordered_items
      SET qty = $3
      WHERE order_id = $1 AND
      menu_item_id = $2;
      `;
    let query3 = `
      INSERT INTO ordered_items (order_id, menu_item_id, qty)
      ($1, $2, $3);
      `;
    db.query(query1, [req.params.menu_item_id, req.body.qty])
      .then(data => {
        if (data.rows) {
          db.query(query2, [data.rows.order_id, req.params.menu_item_id, req.body.qty])
            .then(data => {
            }
            .catch(err => {
              res
                .status(500)
                .json({ error: err.message });;
        }
        res.send('successful order update');
      //   Use below if you want to recieve the updated row data via .json
      // })
      // .then(data => {
      //   const items = data.rows;
      //   res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  // router.post("/menu_items/:menu_item_id", (req, res) => {
  //   console.log('orders/id: works!');
  //   let query1 = `
  //     SELECT order_id, menu_item_id
  //     FROM orders
  //     JOIN LEFT ordered_items ON orders.id = order_id
  //     WHERE order_status = 'PENDING' AND
  //     menu_item_id = $1;
  //   `
  //   let query2 = `
  //     UPDATE ordered_items
  //     SET qty = $3
  //     WHERE order_id = $1 AND
  //     menu_item_id = $2;
  //     `;
  //   let query3 = `
  //     INSERT INTO ordered_items ()
  //     SET qty = $3
  //     WHERE order_id = $1 AND
  //     menu_item_id = $2;
  //     `;
  //   db.query(query1, [req.params.menu_item_id, req.body.qty])
  //     .then(data => {
  //       if (data.rows) {
  //         db.query(query2, [data.rows.order_id, req.params.menu_item_id, req.body.qty])
  //           .then(data => {
  //           }
  //           .catch(err => {
  //             res
  //               .status(500)
  //               .json({ error: err.message });
  //       }
  //       res.send('successful order update');
  //       Use below if you want to recieve the updated row data via .json
  //     })
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

  // Route to zero out entire cart

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

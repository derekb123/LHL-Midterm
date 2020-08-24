/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

//For customer & cart...
router.get("/", (req, res) => {
  let query1 = `
    SELECT * menu_items
      FROM menu_items
    `;
  db.query(query1, )
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

  //General route to adjust order_items quantity in database. AJAX request to define qty.

  router.post("/orders/:order_id/menu_items/:menu_item_id", (req, res) => {
    console.log('orders/id: works!');
    let query = `
      UPDATE ordered_items
      SET qty = $3
      WHERE order_id = $1 AND
      menu_item = $2;
      `;
    db.query(query, [req.params.order_id, req.params.menu_item_id, req.body.qty])
      .then(data => {
        res.send('successful order update');
        //Use below if you want to recieve the updated row data via .json
        //const items = data.rows;
        //res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Route to zero out entire cart

  router.post("/orders/:id/delete", (req, res) => {
    console.log('orders/id: works!');
    let query = `
      INSERT INTO ordered_items (order_id, menu_item_id, qty)
      VALUES ($1, $2, $3)
      `;
    db.query(query, [req.params.id, req.params.id, 1])
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

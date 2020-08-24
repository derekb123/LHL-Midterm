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
  let query = `
    SELECT * menu_items
      FROM menu_items
    `;
  db.query(query, )
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


  router.post("/orders/order_id:/menu_item:/qty:/edit", (req, res) => {
    console.log('orders/id: works!');
    let query = `
      INSERT INTO ordered_items (order_id, menu_item_id, qty)
      VALUES ($1, $2, $3)
      `;
    db.query(query, [req.params.order_id, req.params.menu_item, req.params.qty])
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

  router.post("/orders/id:/delete", (req, res) => {
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

  router.post("/orders/id:/submit", (req, res) => {
    console.log('orders/id: works!');
    let query = `
      INSERT INTO orders (order_status)
      VALUES ($1)
      `;
    db.query(query, [req.params.id])
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

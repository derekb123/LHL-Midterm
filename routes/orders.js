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


  // router.post("/:order_id/menu_items/:menu_item_id", (req, res) => {
  //   console.log('orders/id: works!');
  //   let query = `
  //  router.get("/menu_items/:menu_item_id", (req, res) => {
  //    console.log('orders/id: works!');
  //    let query1 = `
  //     SELECT *
  //     FROM orders
  //     WHERE order_status = 'PENDING';
  //   `
  //   // let query2 = `
  //   //   UPDATE ordered_items
  //   //   SET qty = $3
  //   //   WHERE order_id = $1 AND
  //   //   menu_item_id = $2;
  //   //   `;

  //   db.query(query1)
  //     .then(data => {
  //       const order = data.rows[0];
  //       res.json({order});
  //     })
  //   .catch(err => {
  //     res
  //       .status(500)
  //       .json({ error: err.message });
  // });
  // });

  // ** IF ORDER EXISTS AND ALL MENU ITEMS PRE-EXIST ON ORDER

  // router.post("/menu_items/:menu_item_id", (req, res) => {
  //   console.log('orders/id: works!');
  //   let query1 = `
  //     SELECT *
  //     FROM orders
  //     WHERE orders.user_id = $1 AND
  //     orders.status = 'PENDING';
  //   `
  //   let query2 = `
  //     UPDATE ordered_items
  //     SET qty = $3
  //     WHERE order_id = $1 AND
  //     menu_item_id = $2;
  //     `;

  //   db.query(query1, [req.session.user_id])
  //     .then(data => {
  //       return data.rows;
  //     })
  //     .then(data => {
  //        db.query(query2, [data.rows.order_id, req.params.menu_item_id, req.body.qty])
  //           .then(data => {
  //               res.send('existing order item updated');
  //             })
  //           .catch(err => {
  //             res
  //               .status(500)
  //               .json({ error: err.message });
  //       });
  //     })
  //     .catch(err => {
  //       res
  //         .status(500)
  //         .json({ error: err.message });
  //     });
  // });

  // ** CHECK IF ORDER EXISTS NEEDS TO HAVE CONDITIONAL FOR IF ORDER ITEMS DO NOT EXIST

  router.post("/menu_items/:menu_item_id", (req, res) => {
    console.log('orders/id: works!');
    let selectPendingOrderQuery = `
      SELECT *
      FROM orders
      WHERE orders.user_id = $1 AND
      orders.status = 'PENDING';
    `
    let query2 = `
      UPDATE ordered_items
      SET qty = $3
      WHERE order_id = $1 AND
      menu_item_id = $2;
      `;

    let query3 = `
      INSERT INTO orders (user_id, order_status)
      ($1, PENDING)
      RETURNING *;
      `;

      let query3 = `
      INSERT INTO orders (user_id, order_status)
      ($1, 'PENDING')
      ON CONFLICT ($1,'PENDING')
      RETURNING *;
      `;

    db.query(selectPendingOrderQuery, [req.session.user_id])
      .then(PendingOrder => {
        if (PendingOrder) {
          return PendingOrder.rows[0];
        }
        else {
          return db.query(query3, [req.session.user_id])
            .then(NewPendingOrder => {
              return NewPendingOrder.rows[0];
              })
        }
      })
      .then(data => {
         db.query(query2, [data.rows.order_id, req.params.menu_item_id, req.body.qty])
            .then(data => {
                res.send('existing order item updated');
              })
            .catch(err => {
              res
                .status(500)
                .json({ error: err.message });
        });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/submit", (req, res) => {
    console.log(' works!');
    let query = `
      UPDATE orders (order_status)
      VALUES ($1)
      WHERE user_id = req.session.user_id AND
      order status = 'PENDING';
      `;
    db.query(query, 'COMPLETE')
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
            })
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

//INITIAL CREATE TABLE AT PAGE LOAD
//     let query1 = `
//       SELECT *
//       FROM menu_items
//       `
//       let query2 = `
//       INSERT oders(order_status)
//     `
//     // let query1 = `
//     //   SELECT menu_items.*, orders.*
//     //     FROM menu_items
//     //     JOIN ordered_items ON menu_items.id = ordered_items.menu_items_id
//     //     JOIN RIGHT orders ON ordered_items.order_id = orders.id
//     //     WHERE orders.status = PENDING;
//     //   `;

//     db.query(query1)
//       .then(data => {
//         const results = data.rows;
//         res.json({ items: results });
//       })
//       .then(data => {

//       })
//       .catch(err => {
//         res
//           .status(500)
//           .json({ error: err.message });
//       });
//   // res.redirect("/api/orders");
//   //res.render("index");
// });

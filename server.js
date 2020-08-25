// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require('morgan');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/orders", ordersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {

    let query1 = `
      SELECT *
      FROM menu_items
      `
      let query2 = `
      INSERT oders(order_status)
    `
    // let query1 = `
    //   SELECT menu_items.*, orders.*
    //     FROM menu_items
    //     JOIN ordered_items ON menu_items.id = ordered_items.menu_items_id
    //     JOIN RIGHT orders ON ordered_items.order_id = orders.id
    //     WHERE orders.status = PENDING;
    //   `;

    db.query(query1)
      .then(data => {
        const results = data.rows;
        res.json({ items: results });
      })
      .then(data => {

      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  // res.redirect("/api/orders");
  //res.render("index");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

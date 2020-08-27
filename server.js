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
const session = require('express-session');
const cookieSession = require('cookie-session');


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
app.use(bodyParser.json());
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));
// app.use(session({
//   secret: '239rdkslfkdm29slkda30jlma',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }))

// Middleware
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own

const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");
const widgetsRoutes = require("./routes/widgets");
//const testRoutes = require("./routes/test_oders");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/orders", ordersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
//app.use("/api/test_orders", testRoutes(db)); // /api/test_orders/menu_items/3/newOrder   /api/test_orders/menu_items/3/rohitOrder
// Note: mount other resources here, using the same pattern above


app.get('/login/:id', (req, res) => {
  req.session.user_id = req.params.id;
  res.redirect('/');
});

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  console.log("Req:", req.session);
  let menu_items;
  db.query('SELECT * FROM menu_items')
    .then(data => {
      menu_items = data.rows
      if (req.session.user_id) {
        return db.query(`SELECT * FROM users WHERE id = ${req.session.user_id}`);
      } else {
        return {};
      }
    })
    .then(data => {
      let user = {};
      if (data.rows) {
        user = data.rows[0];
      }

      res.render("index", { menu_items, user }); //pushes menu from database to the homepage
    })
}
);


// deletes all cookies
app.post("/logout", (req, res) => {
  req.session.type = null;
  res.redirect("/");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});




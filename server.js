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
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  db.query('SELECT * FROM menu_items')
    .then(data => {
      const menu_items = data.rows
      res.render("index", { menu_items }); //pushes menu from database to the homepage
    })
}


  // menu_items = [
  //   {
  //     dish: "Fries",
  //     description: "Fries with ketchup",
  //     menu_image_url: 'https://www.cactusclubcafe.com/wp-content/uploads/2020/04/CC_180523_MiniCrispyChickenSandwich_H8827_edited_revised_extended_800x800_web.jpg',
  //     price: 25.50
  //   },
  //   {
  //     dish: "Fries",
  //     description: "Fries with ketchup",
  //     menu_image_url: 'https://www.cactusclubcafe.com/wp-content/uploads/2020/04/CC_180523_MiniCrispyChickenSandwich_H8827_edited_revised_extended_800x800_web.jpg',
  //     price: 25.50
  //   },
  //   {
  //     dish: "Fries",
  //     description: "Fries with ketchup",
  //     menu_image_url: 'https://www.cactusclubcafe.com/wp-content/uploads/2020/04/CC_180523_MiniCrispyChickenSandwich_H8827_edited_revised_extended_800x800_web.jpg',
  //     price: 25.50
  //   }
  // ]

);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

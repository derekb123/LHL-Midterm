/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM widgets`;
    console.log(query);
    db.query(query)
      .then(data => {
        const widgets = data.rows;
        res.json({ widgets });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //send SMS to user example code
  // Needs to figure out user-side handled for twilio; routes? event listener? jQuery?
  /*
  app.post('/order', (req, res) => {
    const { email, password, phone } = req.body;
    const user = {
      email,
      password,
      phone
    };

    userDatabase.push(user);

    const msg = 'hello, this is Caia testing';

    sendSms(user.phone, msg);

    res.status(201).send({
      message: 'Account created successfully, kindly check your phone to activate your account!',
      data: user
    })
  });*/


  return router;
};

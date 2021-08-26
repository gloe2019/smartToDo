/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { getUserByEmail, getUserById, addUser } = require('../db/queries/users-queries');
module.exports = (db) => {

  // Login Page GET Route
  router.get("/login", (req, res) => {
    const userId = req.session.user_id;
    getUserById(userId)
      .then(user => {
        const templateVars = { user };
        res.render("todo_login", templateVars);
        //no more res.render, res.json the response.
      });
  });
  // Login Page POST Route
  router.post('/login', (req, res) => {
    const { email, password } = req.body;
    getUserByEmail(email)
      .then(user => {
        if (password === user.password) {
          req.session.user_id = user.id;
          // const templateVars = { user }
          // res.json(user)
          res.redirect('/');
        } else {
          res.redirect('/login');
        }
      })
      .catch(err => {
        console.log('error:', err.message);
      });
    //console.log(user);
  });
  // Logout POST Route
  router.post('/logout', (req, res) => {
    console.log(req.body);
    req.session = null;
    res.redirect('/');
  });
  // Register Page GET Route
  router.get("/register", (req, res) => {
    const userId = req.session.user_id;
    // console.log('userId', userId)
    getUserById(userId)
      .then(user => {
        const templateVars = { user };
        res.render("todo_register", templateVars);
      });
  });
  //Register Page POST Route
  router.post("/register", (req, res) => {
    console.log(req.body);
    const {name, email, password} = req.body;
    addUser(name, email, password)
      .then((response) => {
        res.redirect('/login');
      });
  });
  // User Page
  router.get("/", (req, res) => {
    const userId = req.session.user_id;
    // console.log('userId', userId)
    getUserById(userId)
      .then(user => {
        const templateVars = { user };
        //fire off a db query to books/movies, etc to retrieve all user lists. pass those into templateVars.
        res.render("index", templateVars);
      })

      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/user", (req, res) => {
    const userId = req.session.user_id;
    // console.log('userId', userId)
    getUserById(userId)
      .then(user => {
        res.json(user);
      });
  });

  return router;
};

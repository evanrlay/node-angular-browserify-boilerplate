var express = require("express");
var User = require("../models/user.js");

module.exports = (function() {

  var router = express.Router();

  // Middleware:
  // TODO INSERT MIDDLEWARE

  // Routes:
  router.get("/", getUsers);
  router.get("/:id", getUser);
  router.get("/")
  router.post("/", addUser);
  router.put("/:id", updateUser);
  router.delete("/:id", deleteUser);

  return router;

})();

function getUsers(req, res) {
  User.find(function(err, users) {
    if(err)
      return res.json({
        message: "Error finding users"
      });

    return res.json(users);
  })
}

function getUser(req, res) {
  res.json({
    message: "Get User"
  })
}

function addUser(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var user = new User({
    username: username, password: password
  });

  user.save(function(err) {
    if(err) {
      if(err.code == 11000) {
        return res.json({
          success: false,
          message: "Username already taken"
        });
      }
      else {
        return res.send(err);
      }
    }

    res.json({
      success: true,
      message: "User created"
    })
  })
}

function updateUser(req, res) {
  res.json({
    message: "Update User"
  })
}

function deleteUser(req, res) {
  res.json({
    message: "Delete User"
  })
}
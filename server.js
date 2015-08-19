(function() {

  // -----------------------------------------------------------------
  // ------------------------ Setup ----------------------------------
  // -----------------------------------------------------------------

  var express = require("express");
  var app = express();
  var bodyParser = require("body-parser");
  var mongoose = require("mongoose");
  var User = require("./api/models/user.js");
  var cors = require("cors");
  var jwt = require("jsonwebtoken");
  var jwt_secret = "IAreDevloper";
  var fs = require("fs");
  var _ = require("underscore");

  var port = process.env.PORT || 8080;
  var dbHost = process.env.DBHOST || "localhost";
  var dbPort = process.env.DBPORT || 27017;
  var dbUser = process.env.DBUSER || undefined;
  var dbPassword = process.env.DBPASSWORD || undefined;

  var database = "devloper";

  // Controller config
  var controllers = [
    {
      controller: "userController",
      routePrefix: "/api/users"
    }
  ];

  // Enable all CORS requests
  app.use(cors());

  // Enable body parser
  app.use(bodyParser.urlencoded({
    extended:true
  }));
  app.use(bodyParser.json());

  // Set up mongoose
  var userInfo = "";
  if(dbUser && dbPassword)
    userInfo = dbUser + ":" + dbPassword + "@";
  var connectionString = "mongodb://" + userInfo + dbHost + ":" + dbPort + "/" + database;
  mongoose.connect(connectionString);

  mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + dbHost + ":" + dbPort);
  });

  // Static file serving
  app.use(express.static(__dirname + "/public"));

  // Handle authentication
  app.post("/api/authenticate", authenticate);

  // Middleware to verify that a user if authenticated
  app.use(validateToken);

  // Send information about themselves if requested to users
  app.get("/api/me", function(req, res) {
    return res.send(req.decoded);
  });

  // Load controllers
  for (var i in controllers) {
    var router = require("./api/controllers/" + controllers[i].controller + ".js");
    app.use(controllers[i].routePrefix, router);
  }

  app.listen(port, function() {
    console.log("Listening on port " + port);
  });

  // -----------------------------------------------------------------
  // ------------------------ Functions ------------------------------
  // -----------------------------------------------------------------

  function authenticate (req, res) {
    /// <summary>Authenticates user login information and returns a token if successful.</summary>

    var username = req.body.username;
    var password = req.body.password;

    User
      .findOne({
        username: username
      })
      .select("username password")
      .exec(function(err, user) {
        if(err) throw err;

        // Check if user is defined. If not, throw 404 error.
        if(!user) {
          return res.status(404).json({
            success: false,
            message: "User not found"
          });
        } else {
          // Check that password supplied is correct. If it is, sign a jwt and send it back.
          if(user.comparePassword(password)) {
            var token = jwt.sign({
              username: username
            }, jwt_secret, {
              expiresInMinutes: 1440
            });
            return res.json({
              success: true,
              token: token
            })
          } else {
            return res.status(404).json({
              success: false,
              message: "Incorrect user/password combination"
            });
          }
        }
      });
  }

  function validateToken(req, res, next) {
    /// <summary>Validates that the user has supplied a valid token before making requests</summary>

    // Get list of all routes that don't require validation and check if user requested one.
    var routes = JSON.parse(fs.readFileSync("./unauthorized_routes.json", "utf8"));

    var requestedRoute = {
      route: req.originalUrl,
      method: req.method
    };

    if(_.findWhere(routes, requestedRoute))
      return next();

    var token = req.body.token || req.query.token || req.headers["x-access-token"];

    // Check if a token was provided. If not, throw a 403 error.
    if(token) {
      // Verify the token using jwt
      jwt.verify(token, jwt_secret, function(err, decoded) {
        if(err)
          return res.status(403).send({
            success: false,
            message: "Failed to authenticate token"
          });

        // Store information about user
        req.decoded = decoded;
        next();
      });
    } else {
      return res.status(403).send({
        success: false,
        message: "No token provided"
      });
    }
  }
})();
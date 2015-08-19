var fs = require("fs");

module.exports = function($routeProvider, $locationProvider) {
  $routeProvider
    .when("/", {
      template: fs.readFileSync(__dirname + "/components/home/homeTemplate.html"),
      controller: require("./components/home/homeController.js"),
      controllerAs: "home"
    })
    .when("/login", {
      template: fs.readFileSync(__dirname + "/components/login/loginTemplate.html"),
      controller: require("./components/login/loginController.js"),
      controllerAs: "login"
    });

  //$locationProvider.html5Mode(true);
};
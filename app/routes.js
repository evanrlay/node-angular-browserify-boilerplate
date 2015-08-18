var fs = require("fs");

module.exports = function($routeProvider) {
  $routeProvider
    .when("/", {
      template: fs.readFileSync(__dirname + "/components/home/homeTemplate.html"),
      controller: require("./components/home/homeController.js"),
      controllerAs: "home"
    });
};
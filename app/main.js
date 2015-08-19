require("angular");
require("angular-route");
require("./services/authService.js");
require("./services/userService.js");

angular.module("app", ["ngRoute", "userService", "authService"])
  .config(require("./routes.js"))
  .controller("mainController", function() {
    var vm = this;
    vm.title = "Devloper";
  });
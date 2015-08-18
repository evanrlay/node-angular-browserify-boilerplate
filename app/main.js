require("angular");
require("angular-route");

angular.module("app", ["ngRoute"])
  .config(require("./routes.js"))
  .controller("mainController", function() {
    var vm = this;
    vm.title = "Devloper";
  });
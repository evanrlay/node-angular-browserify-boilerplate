require("angular");

angular.module("userService", [])

  // ---------------------------------------------------------
  // User Factory
  // ---------------------------------------------------------
  .factory("User", function($http) {
    var userFactory = {};

    userFactory.all = function() {
      return $http.get("/api/users");
    };

    userFactory.get = function(id) {
      return $http.get("/api/users/" + id);
    };

    userFactory.add = function(user) {
      return $http.post("/api/users", user);
    };

    userFactory.update = function(id, user) {
      return $http.put("/api/users/" + id, user);
    };

    userFactory.delete = function(id) {
      return $http.delete("/api/users/" + id);
    };
  });
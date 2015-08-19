require("angular");

angular.module("authService", [])

  // ---------------------------------------------------------
  // Auth Factory
  // ---------------------------------------------------------
  .factory("Auth", function($http, $q, AuthToken) {
    var authFactory = {};

    // Handle login
    authFactory.login = function(username, password) {
      return $http.post("/api/authenticate", {
        username: username,
        password: password
      }).success(function(data) {
        AuthToken.setToken(data.token);
        return data;
      });
    };

    // Handle logout
    authFactory.logout = function() {
      // clear the token on logout
      AuthToken.setToken();
    };

    // Check if user is logged in
    authFactory.isLoggedIn = function() {
      return !!AuthToken.getToken();
    };

    // Get the user info
    authFactory.getUser = function() {
      if(AuthToken.getToken()) {
        return $http.get("/api/me");
      } else {
        return $q.reject({
          message: "User has no token"
        });
      }
    };

    // Return factory object
    return authFactory;
  })

  // ---------------------------------------------------------
  // Auth Token Factory
  // ---------------------------------------------------------
  .factory("AuthToken", function($window) {
    var authTokenFactory = {};

    // Get the token
    authTokenFactory.getToken = function() {
      return $window.localStorage.getItem("token");
    };

    // Set the token or clear it
    authTokenFactory.setToken = function(token) {
      if(token) {
        $window.localStorage.setItem("token", token);
      } else {
        $window.localStorage.removeItem("token");
      }
    };

    return authTokenFactory;
  })

  // ---------------------------------------------------------
  // Auth Interceptor Factory
  // ---------------------------------------------------------
  .factory("AuthInterceptor", function($q, AuthToken) {
    var interceptorFactory = {};

    // Attach the token to every request
    interceptorFactory.request = function(config) {

      // Get user token
      var token = AuthToken.getToken();

      if(token) {
        config.headers["x-access-token"] = token;
      }

      return config;
    };

    // Redirect if token doesn't authenticate
    interceptorFactory.responseError = function(response) {
      if(response.status == 403) {
        AuthToken.setToken();
        $location.path("/login");
      }

      return $q.reject(response);
    };

    return interceptorFactory;
  });
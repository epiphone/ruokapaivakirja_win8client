// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
var myApp;
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    // AngularJS setup
    // Declare app level module which depends on filters, and services
    //myApp = angular.module("app", ["app.filters", "app.services", "app.directives", "app.controllers"])
    //.config(function ($routeProvider, $httpProvider) {

    //    // Routing
    //    $routeProvider.when("/", { templateUrl: "partials/index.html", controller: "IndexCtrl" });
    //    $routeProvider.when("/login", { templateUrl: "partials/login.html", controller: "LoginCtrl" });
    //    $routeProvider.when("/foods", { templateUrl: "partials/foods.html", controller: "FoodSearchCtrl" });

    //    $routeProvider.otherwise({ redirectTo: "/" });

    //    // Enable CORS
    //    $httpProvider.defaults.useXDomain = true;
    //    delete $httpProvider.defaults.headers.common["X-Requested-With"];

    //    // Set HTTP data encoding; by default, Angular uses JSON encoding
    //    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
    //})

    //.run(function ($rootScope, $location, UserService) {
    //    // Redirect to login page if the user tries to access a restricted location
    //    $rootScope.$on("$routeChangeStart", function (event, next, current) {
    //        if (!UserService.isLoggedIn() && next.controller != "LoginCtrl") {
    //            console.log("Redirecting to login page.");
    //            $location.path("/login");
    //        }
    //    });
    //});



    app.start();
})();

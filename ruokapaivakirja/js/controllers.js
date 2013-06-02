/* Controllers */

function LoginCtrl($scope, $http, UserService, HashService) {
    $scope.message = UserService.getUsername();
    $scope.login = function (username, password) {
        UserService.setUserInfo(username, password);
        $scope.message = UserService.getUsername();
    }
}

function TestCtrl($scope, Data, UserService, $http) {
    $scope.update = function() {
        //var promise = Data.fetch("/user/favs", "GET", {});
        //promise.then(function (data) {
        //    console.log("controllerissä:" + JSON.stringify(data));
        //    $scope.data = data;
        //});
        Data.fetch("/user/favs", "GET", {}, function (data) {
            $scope.data = data;
        });
    }

    $scope.update();

}
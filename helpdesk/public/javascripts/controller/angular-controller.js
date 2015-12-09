/**
 * Created by keyurvekariya on 12/2/15.
 */


var helpDeskApp = angular.module('helpDeskApp', ['ngRoute', 'ngCookies', 'ngStorage', 'helpDeskApp.services'])
    .run(function ($rootScope, $location, $cookieStore, $http, $sessionStorage) {
        //$http.defaults.headers.common.Authorization = 'Bearer TKfNLXwKt2yYKgaNYLxVf7I1krLM0EddSIlyKDRAGLTMwWnmoz';
        $http.defaults.headers.common.Authorization = "Bearer " + $sessionStorage.AuthHeader;
    });

helpDeskApp.controller('ticketController', ['$sessionStorage','$scope', '$http', 'ticketService', function ($sessionStorage,$scope, $http, ticketService) {


    $scope.createTicket = function (ticketEntry) {
        ticketEntry.username=$sessionStorage.UserName;
        ticketService.create(ticketEntry)
            .success(function (data) {
                addNotification("Ticket Added successfully : ticketId is " + data._id, "information");
                $scope.ticketEntry = {};
            }).error(function (data) {
                addNotification("Something Went wrong! : " + data.errorMessage, "error");
                console.log("logged in not successfully");
            });
    };



}]);

helpDeskApp.controller('ticketsController', ['$scope', '$http', 'ticketService', function ($scope, $http, ticketService) {

    $scope.tickets = ticketService.getAll()
        .success(function (data) {
            $scope.tickets = data;
        });

    $scope.delete = function (ticket) {
        console.log(ticket._id);
        ticketService.delete(ticket._id)
            .success(function (data) {
                $scope.tickets = ticketService.getAll()
                    .success(function (data) {
                        $scope.tickets = data;
                    });
            });
    };
}]);


helpDeskApp.controller('userController', ['$sessionStorage', '$scope', '$http', '$window', 'userService', function ($sessionStorage, $scope, $http, $window, userService) {

    $scope.logout = function () {
        $sessionStorage.AuthHeader = '';
        $sessionStorage.UserName = '';
        $sessionStorage.$reset();
        $window.location.href = '/';

    };

    $scope.profile = userService.getProfile($sessionStorage.UserName)
        .success(function (data) {
            $scope.profile = data;
        });

    $scope.register = function (userEntry) {
        userService.register(userEntry)
            .success(function (data) {
                addNotification("User Added successfully : UserId is " + data._id, "information");
                $scope.userEntry = {};
                toggle('div#login', 'div#registration');
            });
    }, $scope.login = function (loginEntry) {
        loginEntry.grant_type = "password";

        userService.login(loginEntry).success(function (data) {
            $sessionStorage.AuthHeader = data.access_token;
            $sessionStorage.UserName = loginEntry.username;
            $window.location.href = '/ticket';
        }).error(function () {
            $sessionStorage.AuthHeader = '';
            $sessionStorage.UserName = '';
            addNotification("User Entered Credential are incorrect!", "error");
            console.log("logged in not successfully");
        });
    };

}]);
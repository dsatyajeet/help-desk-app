/**
 * Created by keyurvekariya on 12/2/15.
 */


var helpDeskApp = angular.module('helpDeskApp', ['ngRoute', 'ngCookies', 'ngStorage', 'helpDeskApp.services'])
    .run(function ($rootScope, $location, $cookieStore, $http, $sessionStorage,$window) {
        //$http.defaults.headers.common.Authorization = 'Bearer TKfNLXwKt2yYKgaNYLxVf7I1krLM0EddSIlyKDRAGLTMwWnmoz';
        $http.defaults.headers.common.Authorization = "Bearer " + $sessionStorage.AuthHeader;
        var absUrl = $location.absUrl();

        if(!$sessionStorage.AuthHeader && absUrl!="http://localhost:8080/"){
            $window.location.href = '/';
        }
    });

helpDeskApp.filter('dateFormat', function($filter)
{
    return function(input)
    {
        if(input == null){ return ""; }

        var _date = $filter('date')(new Date(input), 'MMM dd yyyy');

        return _date.toUpperCase();

    };
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

helpDeskApp.controller('ticketsController', ['$sessionStorage', '$scope', '$http', 'ticketService', function ($sessionStorage, $scope, $http, ticketService) {

    $scope.tickets = ticketService.getAll($sessionStorage.UserName)
        .success(function (data) {
            $scope.tickets = data;
        });

    $scope.delete = function (ticket) {
        ticketService.delete(ticket._id)
            .success(function (data) {
                $scope.tickets = ticketService.getAll($sessionStorage.UserName)
                    .success(function (data) {
                        addNotification("Ticket Deleted successfully ", "information");
                        $scope.tickets = data;
                    });
            });
    };
}]);

helpDeskApp.controller('adminTicketsController', ['$sessionStorage', '$scope', '$http', 'ticketService', function ($sessionStorage, $scope, $http, ticketService) {

    $scope.adminTickets = ticketService.getAdminTickets()
        .success(function (data) {
            $scope.adminTickets = data;
        });

    $scope.updateStatus = function (ticketId) {

        ticketService.updateStatus(ticketId)
            .success(function (data) {
                addNotification("Ticket status updated successfully ", "information");
                $scope.adminTickets = ticketService.getAdminTickets()
                    .success(function (data) {
                        $scope.adminTickets = data;
                    });
            });
    };



}]);


helpDeskApp.controller('userController', ['$sessionStorage', '$scope', '$http', '$window', 'userService','$timeout', function ($sessionStorage, $scope, $http, $window, userService,$timeout) {

    $scope.logout = function () {
        $sessionStorage.AuthHeader = '';
        $sessionStorage.UserName = '';
        $sessionStorage.$reset();
        $window.location.href = '/';

    };

    $scope.register = function (userEntry) {
        userEntry.roles='Customer';
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

            $scope.profile = userService.getProfile().success(function (profile) {
                if (profile.roles[0].name === 'Admin') {

                    $window.location.href = '/ticket/adminTickets';
                } else {
                    $window.location.href = '/ticket/myTickets';
                }
            });

        }).error(function () {
            $sessionStorage.AuthHeader = '';
            $sessionStorage.UserName = '';
            addNotification("User Entered Credential are incorrect!", "error");
            console.log("logged in not successfully");
        });
    };

}]);

helpDeskApp.controller('profileController', ['$sessionStorage', '$scope', '$http', '$window', 'userService', function ($sessionStorage, $scope, $http, $window, userService) {

    $scope.profile = userService.getProfile($sessionStorage.AuthHeader)
        .success(function (data) {
            $scope.profile = data;
            $scope.userEntry=data;
        });


    $scope.logout = function () {
        $sessionStorage.AuthHeader = '';
        $sessionStorage.UserName = '';
        $sessionStorage.$reset();
        $window.location.href = '/';

    };

    $scope.viewProfile = function(){
        $window.location.href = '/users/profile';
    };

    $scope.update = function(userEntry){
        userService.update(userEntry)
            .success(function (data) {
                addNotification("User Update successfully : UserId is " + data._id, "information");
            });
    }

}]);
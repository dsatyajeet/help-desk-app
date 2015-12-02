/**
 * Created by keyurvekariya on 12/2/15.
 */


var helpDeskApp = angular.module('helpDeskApp', ['ngRoute', 'ngCookies', 'helpDeskApp.services'])
    .run(function ($rootScope, $location, $cookieStore, $http) {
        $http.defaults.headers.common.Authorization = 'Bearer TKfNLXwKt2yYKgaNYLxVf7I1krLM0EddSIlyKDRAGLTMwWnmoz';
    });

helpDeskApp.controller('ticketController', ['$scope', '$http', 'ticketService', function ($scope, $http, ticketService) {

    $scope.createTicket = function (ticketEntry) {
        ticketService.create(ticketEntry)
            .success(function (data) {
                addNotification("Ticket Added successfully : ticketId is " + data._id,"success");
                $scope.ticketEntry={};
            });
    };

}]);
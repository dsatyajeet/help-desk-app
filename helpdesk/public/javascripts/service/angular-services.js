/**
 * Created by keyurvekariya on 12/2/15.
 */


var services = angular.module('helpDeskApp.services', ['ngStorage']);

services.factory('ticketService', ['$http', function ($http) {
    return {
        get: function (id) {
            return $http.get('/ticket/get/' + id);
        },
        create: function (ticketData) {
            return $http.post('/ticket/add', ticketData);
        },
        delete: function (id) {
            return $http.delete('/ticket/delete/' + id);
        },
        getAll: function(userName) {
            return $http.get('/ticket/getAll/'+userName);
        },
        getAdminTickets: function() {
            return $http.get('/ticket/getAdminTickets');
        },

        updateStatus: function(ticketId) {
            return $http.put('/ticket/updateStatus/'+ticketId);
        }
    }
}]);


services.factory('userService', ['$http','$sessionStorage', function ($http,$sessionStorage) {
    var config = {
        headers: {
            'Authorization': 'Basic aWhlbHA6aXNlY3JldA==',
            'Accept': 'application/json;'
        }
    };
    return {
        register: function (userData) {
            return $http.post('/users/add', userData, config);
        },
        login: function (userData) {
            return $http.post('/users/oauth/token', userData, config);
        },
        getProfile: function () {
            var config ={
                headers: {
                    'Authorization': 'Bearer '+$sessionStorage.AuthHeader,
                    'Accept': 'application/json;'
                }
            };
            return $http.get('/users/myProfile',config);
        },
        update: function (userData) {
            return $http.put('/users/update', userData);
        }

    }
}]);
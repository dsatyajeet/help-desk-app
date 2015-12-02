/**
 * Created by keyurvekariya on 12/2/15.
 */


var services = angular.module('helpDeskApp.services', [ ]);

services.factory('ticketService', ['$http',function($http) {
        return {
            get : function(id) {
                return $http.get('/ticket/get/'+id);
            },
            create : function(ticketData) {
                return $http.post('/ticket/add', ticketData);
            },
            delete : function(id) {
                return $http.delete('/ticket/delete/' + id);
            }
        }
    }]);
/**
 * Created by rafael on 6/03/17.
 */

'use strict';

// Array last() function
Array.prototype.last = function() {
    return this[this.length - 1];
};

var app = angular.module('gabrielArchitect', []);

/**app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/joeOverview.html',
            controller: 'OverviewController as overviewCtrl'
        })
        .when('/editroute', {
            templateUrl: 'templates/routeEditor.html',
            controller: 'RouteEditorController as routeCtrl'
        });
});**/
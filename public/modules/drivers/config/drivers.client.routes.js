'use strict';

//Setting up route
angular.module('drivers').config(['$stateProvider',
	function($stateProvider) {
		// Drivers state routing
		$stateProvider.
		state('listDrivers', {
			url: '/drivers',
			templateUrl: 'modules/drivers/views/list-drivers.client.view.html'
		});
	}
]);

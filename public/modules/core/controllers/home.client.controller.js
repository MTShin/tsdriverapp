'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.alerts = [
			{
				icon:'glyphicon-book',
				color:'btn-success',
				total:'20,408',
				description:'TOTAL DRIVERS'
			},
			{
				icon:'glyphicon-wrench',
				color:'btn-primary',
				total:'8,382',
				description:'DRIVERS IN DEVELOPMENT'
			},
			{
				icon:'glyphicon-time',
				color:'btn-success',
				total:'527',
				description:'NEW DRIVERS IN PAST MONTH'
			},
			{
				icon:'glyphicon-ok',
				color:'btn-info',
				total:'85,000',
				description:'INSTRUMENTS DEPLOYED'
			},
			{
				icon:'glyphicon-eye-open',
				color:'btn-warning',
				total:'268',
				description:'FOLLOW UP REQUIRED'
			},
			{
				icon:'glyphicon-flag',
				color:'btn-danger',
				total:'348',
				description:'REFERRALS TO MODERATE'
			}
		];

	}
]);

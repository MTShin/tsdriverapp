'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.homelabels = [
			{
				icon:'glyphicon-file',
				color:'text-info',
				name:'PRE-OP',
				description:'Research being done on instrument'
			},
			{
				icon:'glyphicon-file',
				color:'text-info',
				name:'DOABLE',
				description:'Deemed enable-able post PRE-OP research'
			},
			{
				icon:'glyphicon-file',
				color:'text-success',
				name:'DEMO',
				description:'Basic enablement done for a customer demo'
			},
			{
				icon:'glyphicon-file',
				color:'text-warning',
				name:'IN PROGRESS',
				description:'Development and testing stage, not ready for deployment'
			},
			{
				icon:'glyphicon-file',
				color:'text-success',
				name:'DEPLOYED',
				description:'Tested and in use or have been used by customers'
			},
			{
				icon:'glyphicon-file',
				color:'text-danger',
				name:'CANCELLED',
				description:'Terminated for various reasons'
			}
		];


	}
]);

'use strict';

//Drivers service used to communicate Drivers REST endpoints

angular.module('drivers')

	.factory('Drivers', ['$resource',
		function($resource) {
			return $resource('drivers/:driverId', { driverId: '@_id'
			}, {
				update: {
					method: 'PUT'
				}
			});
		}
	])

	.factory('Notify', ['$rootScope', function($rootScope) {

		var notify = {};

		notify.sendMsg = function(msg, data) {
			data = data || {};
			$rootScope.$emit(msg, data);

			console.log('message sent!');
		};

		notify.getMsg = function(msg, func, scope) {
			var unbind = $rootScope.$on(msg, func);

			if(scope) {
				scope.$on('destroy', unbind);
			}
		};

		return notify;

		}
	]);

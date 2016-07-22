'use strict';

// Drivers controller

var driversApp = angular.module('drivers');

driversApp.controller('DriversController', ['$scope', '$stateParams', 'Authentication', 'Drivers', '$modal', '$log',
	function($scope, $stateParams, Authentication, Drivers, $modal, $log) {

		this.authentication = Authentication;

		// Find a list of Drivers
		this.drivers = Drivers.query();

		// Open modal window to create a single driver
		this.modalCreate = function (size) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/drivers/views/create-driver.client.view.html',
				controller: function($scope, $modalInstance) {

					$scope.ok = function () {
							$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				},
				size: size
			});

			modalInstance.result.then(function (selectedItem) {
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};

		// Open modal window to update a single driver
		this.modalUpdate = function (size, selectedDriver) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/drivers/views/edit-driver.client.view.html',
				controller: function($scope, $modalInstance, driver) {
					$scope.driver = driver;

					$scope.ok = function () {
							$modalInstance.close($scope.driver);
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');

                        window.location.reload();

					};
				},
				size: size,
				resolve: {
					driver: function () {
						return selectedDriver;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};

		// Remove existing Driver
		this.remove = function(driver) {
			if(confirm('Are you sure you want to delete this driver?\n          Press Cancel to Update instead!')) {
				if (driver) {
					driver.$remove();

					for (var i in this.drivers) {
						if (this.drivers [i] === driver) {
							this.drivers.splice(i, 1);
						}
					}
				}
			}
				else {
					this.driver.$remove(function () {
					});
				}
		};

	}
]);

driversApp.controller('DriversCreateController', ['$scope', 'Drivers', 'Notify',
	function($scope, Drivers, Notify) {
		// Create new Driver
		this.create = function() {
			// Create new Driver object
			var driver = new Drivers ({
				driverName: this.driverName,
				driverId: this.driverId,
				communication: this.communication,
				company: this.company,
				instrument: this.instrument,
				deviceType: this.deviceType,
				description: this.description,
				deployed: this.deployed,
				instrumentType: this.instrumentType,
				status: this.status,
                instruction: this.instruction,
                torg: this.torg,
                customer: this.customer,
                tscontact: this.tscontact,
                engineer: this.engineer,
                cost: this.cost,

			});

			// Redirect after save
			driver.$save(function(response) {

				Notify.sendMsg('NewDriver', {'id': response._id});

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);

driversApp.controller('DriversUpdateController', ['$scope', 'Drivers', 'Notify',
	function($scope, Drivers, Notify) {

		// Update existing Driver
		this.update= function(updatedDriver) {
			var driver = updatedDriver;

            //Redirect after update
			driver.$update(function(response) {

                Notify.sendMsg('NewDriver', {'id': response._id});

            }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);

driversApp.directive('driverList', ['Drivers', 'Notify', function(Drivers, Notify) {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'modules/drivers/views/driver-list-template.html',
		link: function(scope, element, attrs) {

			//When a new driver is added or an existing driver is updated, update the driver list
			Notify.getMsg('NewDriver', function(event, data) {

				scope.driversCtrl.drivers = Drivers.query();

			});
		}
	};
}]);

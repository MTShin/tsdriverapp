'use strict';

// Configuring the Articles module
angular.module('drivers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Drivers', 'drivers', 'dropdown', '/drivers(/create)?');
		Menus.addMenuItem('topbar', 'Driver Database', 'drivers', '/drivers(/create)?');
		//Menus.addSubMenuItem('topbar', 'drivers', 'New Driver', 'drivers/create');
	}
]);

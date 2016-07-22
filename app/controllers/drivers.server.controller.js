'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Driver = mongoose.model('Driver'),
	_ = require('lodash');

/**
 * Create a Driver
 */
exports.create = function(req, res) {
	var driver = new Driver(req.body);
	driver.user = req.user;

	driver.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(driver);
		}
	});
};

/**
 * Show the current Driver
 */
exports.read = function(req, res) {
	res.jsonp(req.driver);
};

/**
 * Update a Driver
 */
exports.update = function(req, res) {
	var driver = req.driver ;

	driver = _.extend(driver , req.body);

	driver.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(driver);
		}
	});
};

/**
 * Delete an Driver
 */
exports.delete = function(req, res) {
	var driver = req.driver ;

	driver.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(driver);
		}
	});
};

/**
 * List of Drivers
 */
exports.list = function(req, res) { 
	Driver.find().sort('-created').populate('user', 'displayName').exec(function(err, drivers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(drivers);
		}
	});
};

/**
 * Driver middleware
 */
exports.driverByID = function(req, res, next, id) { 
	Driver.findById(id).populate('user', 'displayName').exec(function(err, driver) {
		if (err) return next(err);
		if (! driver) return next(new Error('Failed to load Driver ' + id));
		req.driver = driver ;
		next();
	});
};

/**
 * Driver authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.driver.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

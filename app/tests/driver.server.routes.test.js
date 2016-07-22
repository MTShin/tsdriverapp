'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Driver = mongoose.model('Driver'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, driver;

/**
 * Driver routes tests
 */
describe('Driver CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Driver
		user.save(function() {
			driver = {
				name: 'Driver Name'
			};

			done();
		});
	});

	it('should be able to save Driver instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Driver
				agent.post('/drivers')
					.send(driver)
					.expect(200)
					.end(function(driverSaveErr, driverSaveRes) {
						// Handle Driver save error
						if (driverSaveErr) done(driverSaveErr);

						// Get a list of Drivers
						agent.get('/drivers')
							.end(function(driversGetErr, driversGetRes) {
								// Handle Driver save error
								if (driversGetErr) done(driversGetErr);

								// Get Drivers list
								var drivers = driversGetRes.body;

								// Set assertions
								(drivers[0].user._id).should.equal(userId);
								(drivers[0].name).should.match('Driver Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Driver instance if not logged in', function(done) {
		agent.post('/drivers')
			.send(driver)
			.expect(401)
			.end(function(driverSaveErr, driverSaveRes) {
				// Call the assertion callback
				done(driverSaveErr);
			});
	});

	it('should not be able to save Driver instance if no name is provided', function(done) {
		// Invalidate name field
		driver.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Driver
				agent.post('/drivers')
					.send(driver)
					.expect(400)
					.end(function(driverSaveErr, driverSaveRes) {
						// Set message assertion
						(driverSaveRes.body.message).should.match('Please fill Driver name');
						
						// Handle Driver save error
						done(driverSaveErr);
					});
			});
	});

	it('should be able to update Driver instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Driver
				agent.post('/drivers')
					.send(driver)
					.expect(200)
					.end(function(driverSaveErr, driverSaveRes) {
						// Handle Driver save error
						if (driverSaveErr) done(driverSaveErr);

						// Update Driver name
						driver.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Driver
						agent.put('/drivers/' + driverSaveRes.body._id)
							.send(driver)
							.expect(200)
							.end(function(driverUpdateErr, driverUpdateRes) {
								// Handle Driver update error
								if (driverUpdateErr) done(driverUpdateErr);

								// Set assertions
								(driverUpdateRes.body._id).should.equal(driverSaveRes.body._id);
								(driverUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Drivers if not signed in', function(done) {
		// Create new Driver model instance
		var driverObj = new Driver(driver);

		// Save the Driver
		driverObj.save(function() {
			// Request Drivers
			request(app).get('/drivers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Driver if not signed in', function(done) {
		// Create new Driver model instance
		var driverObj = new Driver(driver);

		// Save the Driver
		driverObj.save(function() {
			request(app).get('/drivers/' + driverObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', driver.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Driver instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Driver
				agent.post('/drivers')
					.send(driver)
					.expect(200)
					.end(function(driverSaveErr, driverSaveRes) {
						// Handle Driver save error
						if (driverSaveErr) done(driverSaveErr);

						// Delete existing Driver
						agent.delete('/drivers/' + driverSaveRes.body._id)
							.send(driver)
							.expect(200)
							.end(function(driverDeleteErr, driverDeleteRes) {
								// Handle Driver error error
								if (driverDeleteErr) done(driverDeleteErr);

								// Set assertions
								(driverDeleteRes.body._id).should.equal(driverSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Driver instance if not signed in', function(done) {
		// Set Driver user 
		driver.user = user;

		// Create new Driver model instance
		var driverObj = new Driver(driver);

		// Save the Driver
		driverObj.save(function() {
			// Try deleting Driver
			request(app).delete('/drivers/' + driverObj._id)
			.expect(401)
			.end(function(driverDeleteErr, driverDeleteRes) {
				// Set message assertion
				(driverDeleteRes.body.message).should.match('User is not logged in');

				// Handle Driver error error
				done(driverDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Driver.remove().exec();
		done();
	});
});
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Driver Schema
 */
var DriverSchema = new Schema({

	driverName: {
		type: String,
		default: '',
		trim: true
	},
	driverId: {
		type: String,
		default: '',
		trim: true
	},
	communication: {
		type: String,
		default: '',
		trim: true
	},
	company: {
		type: String,
		default: '',
		trim: true
	},
	instrument: {
		type: String,
		default: '',
		trim: true
	},
	deviceType: {
		type: String,
		default: '',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	instrumentType: {
		type: String,
		default: '',
		trim: true
	},
	status: {
		type: String,
		default: '',
		trim: true
	},
    instruction: {
	    type: String,
        default: '',
        trim: true
    },
    torg: {
        type: String,
        default: '',
        trim: true
    },
    customer: {
        type: String,
        default: '',
        trim: true
    },
    tscontact: {
        type: String,
        default: '',
        trim: true
    },
    engineer: {
        type: String,
        default: '',
        trim: true
    },
    cost: {
        type: String,
        default: '',
        trim: true
    },
	jira: {
		type: String,
		default: '',
		trim: true
	},
	dataextraction: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});


mongoose.model('Driver', DriverSchema);

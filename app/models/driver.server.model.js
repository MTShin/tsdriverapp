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
	//firstName
	driverName: {
		type: String,
		default: '',
		trim: true
	},
	//surname
	driverId: {
		type: String,
		default: '',
		trim: true
	},
	//suburb
	communication: {
		type: String,
		default: '',
		trim: true
	},
	//country
	company: {
		type: String,
		default: '',
		trim: true
	},
	//industry
	instrument: {
		type: String,
		default: '',
		trim: true
	},
	//email
	deviceType: {
		type: String,
		default: '',
		trim: true
	},
	//phone
	description: {
		type: String,
		default: '',
		trim: true
	},
	//referred
	deployed: {
		type: Boolean
	},
	//channel
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

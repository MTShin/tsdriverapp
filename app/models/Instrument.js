/*
*  Instrument meta data
* */

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;
var mixType  = mongoose.Schema.Types.Mixed;

var InstrumentSchema = new mongoose.Schema({


    parent      :       {type: ObjectId, ref: 'Instrument'},

    driver      :       {type: ObjectId, ref: 'Driver'},
    status      :       {type: String},
    type        :       {type: String},
    model       :       {type: mixType},
    manufacturer:       {type: String},
    time        :       {type: Date, default: Date.now},
    tOrg        :       {type: ObjectId, ref: 'Organization'},
    uOrg        :       [{type: ObjectId, ref: 'Organization'}],
    price       :       {type: mixType},
    instruction :       {
        userManual      :       [{type: String}],
        tutorial        :       [{type: String}]
    },
    dataExtraction  : {type: String, enum: ['command','log','']}


});

mongoose.model('Instrument', InstrumentSchema);

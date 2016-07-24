/*
* 1. force structure in ts driver design--> reduce customization and lead to generic UI
* 2. perform basic driver validation
* 3. reference Instrument meta data in the driver, potentially tie tOrg, Customer Success and other crucial value-add together
* */

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;
var MixType  = mongoose.Schema.Types.Mixed;

var availableUnits  = ['degC', 'degF', 'Watt', 'psi']; // and many other, ts owns the conversion, pronounciation (phone call) and format
var availableColors = ['#ff0000', '#ff0020'];

var SerialComSchema = new Mongoose.Schema({
    port        :  {type:String, default: '/dev/ttyUSB0'},
    baudRate    :  {type:Number, default: 9600, enum: [9600,14400, 19200,28800,38400,57600, 115200, 230400]},
    stopBits    :  {type:Number, default: 1, enum: [0, 1]},
    dataBits    :  {type:Number, default: 8, enum: [6,7,8]},
    parity      :  {type:String, default: 'none', enum: ['none','odd','even']}

});

var SensorSchema = new Mongoose.Schema({
    command_id          : {type: String},
    command_params      : [{
        cmd_param   : {type: String},
        default_val : MixType,
        param_min   : {type: Number},
        param_max   : {type: Number}
    }],
    cmd_description : {type: String}
    interval            : {type: Number, default: 5, min: 0.8}
});

var TriggerSchema = new Mongoose.Schema({
    trigger_type        :   {type: String, enum: ['state','numerical']},
    trigger_labels      :   [{value: Number, label: String}],
    trigger_eval        :   {type: String}
});

var FeedSchema = new Mongoose.Schema({
    parameter_id            : {type: String, required: [true, 'Every parameter must have an id']},
    display_name            : {type: String}, // for display
    unit                    : {type: String, enum: [availableUnits]},
    color                   : {type: String, enum: [availableColors]},
    triggerType             : TriggerSchema
});

var FilterSchema = new Mongoose.Schema({
    regex       :   {type: String},
    action      :   [{action_id: String, property: String, value: String}]
});

var CommandSchema = new Mongoose.Schema({
    command_id              :   {type: String, required: [true, 'Every command needs an id']},
    sample_response         :   {type: String},
    sample_response_final   :   {type: String},
    filter                  :   FilterSchema,
    timeout                 :   {type: Number},
    pre_process_func        :   {type: String},
    priority                :   {type: Number, default: 3, enum: [1,2,3]} // todo: how many levels of priority?
});

var UISchema = new Mongoose.Schema({
    partial                 :   {type: String},
    logo                    :   {type: String}
});

var DriverSchema = new mongoose.Schema({

    instrument : {type: ObjectId, ref: 'Instrument'},
    communication : {
        serial : SerialComSchema,
        bash   : ''
    },
    global      : {
        delimiter   :   {type: String},
        timeout     :   {type: Number, default:1, min: 0.1}
    },
    sensors     :   [SensorSchema],
    feeds       :   [FeedSchema],
    commands    :   [CommandSchema],
    unsolicited :   { // todo: how to combine unsolicited and command-driven 
        sample_response_files   :   [{type:String}],
        filters                 :   [FilterSchema]
    },
    ui          :   UISchema,
    other       :   MixType
});

mongoose.model('Driver', DriverSchema);



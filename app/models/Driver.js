/*
* 1. force structure in ts driver design--> reduce customization and lead to generic UI
* 2. perform basic driver validation
* 3. reference Instrument meta data in the driver, potentially tie tOrg, Customer Success and other crucial value-add together
* */

var Mongoose = require('mongoose');

var ObjectId = Mongoose.Schema.Types.ObjectId;
var MixType  = Mongoose.Schema.Types.Mixed;

var availableUnits  = ['degC', 'degF', 'Watt', 'psi']; // and many other, ts owns the conversion, pronounciation (phone call) and format
var availableColors = ['#ff0000', '#ff0020']; // and many others, ts owns the color.
var availableActions = ['evaluateTrigger']; // all the actions available on TS.

/** Serial Communication **/
var SerialComSchema = {
    port        :  {type:String, default: '/dev/ttyUSB0'},
    baudRate    :  {type:Number, default: 9600, enum: [9600,14400, 19200,28800,38400,57600, 115200, 230400]},
    stopBits    :  {type:Number, default: 1, enum: [0, 1]},
    dataBits    :  {type:Number, default: 8, enum: [6,7,8]},
    parity      :  {type:String, default: 'none', enum: ['none','odd','even']}

};



/** Action **/
    // todo: should require this from else where? since this is only the driver model
var Action = {
    action_name :   {type: String, required: [true, 'Every action needs an action_name']},
    action_type :   {type: String, required: true, enum:['webhook','notification','command']},
    property    :   {type: String}, //todo: what's this for
    value       :   {type: String}, //todo: what's this for
    notification_method      :   {type: String, enum: ['email','sms','phone']},
    notification_template    :   {type: String},  // if none, will use the default template. todo: introduce view model, and save template there.
    webhook_url :   {type: String}, // post todo: check if this a valid url
    webhook_method : {type: String, default: 'post', enum: ['get','post']},
    command_name:   {type: String},
    exec_command_at: {type: ObjectId, ref: 'Device'} // execute the command as device
};

/** Trigger **/
var TriggerSchema = {
    trigger_name        :   {type: String, required: [true, 'Every trigger needs a trigger_name']},
    trigger_type        :   {type: String, enum: ['filter','feed','onlineOffline','maintenance']},
    trigger_labels      :   [{value: Number, label: String}],
    trigger_eval        :   {type: String},
    trigger_action      :   [Action], // action will have access to trigger.metaData, device group, feed data or the raw data passed into the filter and the returns from the regex
    allow_multiple      :   {type: Boolean, default: true},  // user can create multiple feed trigger, maybe it's UI's job to know if multiple can be created
                                                             // if false, then display trigger as a check box

    one_time            :   {type: Boolean, default: false}, // one_time trigger can only be triggered once, i.e, 'alert me when idle' (could be overkill)

    feed_name           :   {type: String}, // if trigger_type is feed, feed_name is required
    filter_name         :   {type: String}, // if trigger_type is filter, filter_name is required
    meta_data_properties:   [{name: {type: String}}] // what metaData should the trigger ask for, for example 'operatorId',
                                                    // such that in trigger_eval something like the following becomes feasible
                                                    // 'if (!trigger.metaData.operator) { return true; } var operator;
                                                    // if (device.currentCycle && device.currentCycle.metaData) {
                                                    // operator = device.currentCycle.metaData.userId;
                                                    // }
                                                    // return operator === trigger.operator;'
};

/** Filter **/
var FilterSchema = new Mongoose.Schema({
    filter_name     :   {type: String},
    regex           :   {type: String}, //todo: should validate that the regex is safe.
    returns         :   [{feed_name: String}], // should match the feed_name in the feeds section.
    action          :   [Action],           // these actions will be invoked after regex match
    triggers        :   [TriggerSchema], // the trigger will have access to raw_value passed into the filter and the returns from the regex
    error_handling  :   {type: String} // some kind of error handling
});

/** Command **/
var CommandSchema = new Mongoose.Schema({
    command_name            :   {type: String, required: [true, 'Every command needs a command_name']},
    command_string          :   {type: String},
    command_params          :   [{
        command_param   :   {type: String}, // param name, should match exactly with the one used in the command_string 'ab{command_param}\r'
        default_val     :   MixType,
        param_min       :   {type: Number},
        param_max       :   {type: Number}
    }],
    command_description     :   {type: String},
    sample_response         :   {type: String},
    sample_response_final   :   {type: String},
    timeout                 :   {type: Number}, // if there is no timeout, global.timeout will be used
    pre_process_func        :   {type: String},
    post_process_func       :   {type: String},
    priority                :   {type: Number, default: 2, enum: [1,2,3,4,5]}, // command priority

    filters                 :   [FilterSchema]
});

/** Feed **/
var FeedSchema = {
    feed_name               :   {type: String, required: [true, 'Every feed must have name']},
    feed_label              :   {type: String}, // for display on browser, if undefined, will use the "feed_name" field
    save_feed               :   {type: Boolean, default: true},
    unit                    :   {type: String, enum: [availableUnits]}, // ts will NOT go back to convert the existing feed data if unit is changed.
    unit_choices            :   [{type: String, enum: [availableUnits]}], // a list of units that instrument can send the data with and user can visualize the data with
    color                   :   {type: String, enum: [availableColors]},
    triggers                :   [TriggerSchema]
};

/** Sensor **/
var SensorSchema = new Mongoose.Schema({
    command             :   CommandSchema,
    interval            :   {type: Number, default: 5, min: 0.8}
});

/** UI **/
var UISchema = new Mongoose.Schema({
    partial                 :   {type: String},
    logo                    :   {type: String}
});


/** File Uploader Schema**/
var FileUploaderSchema = new Mongoose.Schema({
    watch_folder    :   {type: String},
    include_file_type :   [{type:String}],
    ignore_file_type : [{type:String}]

});

/** API **/
var ApiSchema = new Mongoose.Schema({
    service     :   {type: String}, // the service that should query for data
    server_url  :   {type: String}
});

/** Driver **/
var DriverSchema = new Mongoose.Schema({
    // ref to instrument model
    instrument      :   {type: ObjectId, ref: 'Instrument'},

    tOrg            :   {type: String},
    communication : {
        serial      :   SerialComSchema,
        bash        :   '',     // todo: bash script and also allow bash script to take parameter,should bash be part of a command?
        file        :   FileUploaderSchema,
        api         :   ApiSchema
    },
    global          :   {
        delimiter   :   {type: String},
        timeout     :   {type: Number, default:1, min: 0.1}
    },
    sensors         :   [SensorSchema],
    feeds           :   [FeedSchema],
    commands        :   [CommandSchema],
    unsolicited     :   {
        // todo: how to combine unsolicited and command-driven, or it's ok to separate them for now?
        // todo: we can think of 'unsolicited' as one particular type of command, thus can be nest unsolicited inside commands
        sample_response_files   :   [{type:String}],
        filters                 :   [FilterSchema]
    },
    ui              :   UISchema,

    triggers        :   [TriggerSchema], // these are the triggers that the user is allowed to create
    // random stuff
    other           :   MixType,


    // todo: use mongoose descriminator/sub class
    // device specific configuration
    // address and etc
    device_config    :  [{
        name  :  {type: String},
        type  :  {type: String, default: 'string', enum: ['string','number']}
    }],

    // user specific configuration
    // operator Id and etc
    user_config      :  [{
        name  :  {type: String},
        type  :  {type: String, default: 'string', enum: ['string','number']}
    }]

});

Mongoose.model('Driver', DriverSchema);



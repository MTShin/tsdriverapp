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

/** Serial Communication **/
var SerialComSchema = new Mongoose.Schema({
    port        :  {type:String, default: '/dev/ttyUSB0'},
    baudRate    :  {type:Number, default: 9600, enum: [9600,14400, 19200,28800,38400,57600, 115200, 230400]},
    stopBits    :  {type:Number, default: 1, enum: [0, 1]},
    dataBits    :  {type:Number, default: 8, enum: [6,7,8]},
    parity      :  {type:String, default: 'none', enum: ['none','odd','even']}

});



/** Trigger Action **/
var TriggerActionSchema = new Mongoose.Schema({
    method      :   {type: String, enum: ['email','sms','phone']},
    template    :   {type: String}  // if none, will use the default template. todo: introduce view model, and save template there.
});

/** Trigger **/
var TriggerSchema = new Mongoose.Schema({       // todo: just use obj
    allow_multiple      :   {type: Boolean, default: true}, // whether it's allowed to create multiple trigger on temperature feed
                                                            // todo: what if trigger is created and then the driver changes, how about legacy triggers

    trigger_type        :   {type: String, enum: ['state','numerical','connectivity']},
    trigger_labels      :   [{value: Number, label: String}],
    trigger_eval        :   {type: Function},

    one_time            :   {type: Boolean, default: false}, // one_time trigger can only be triggered once, i.e, 'alert me when idle' (could be overkill)
    trigger_action      :   [TriggerActionSchema]
});

/** Filter **/
var FilterSchema = new Mongoose.Schema({
    regex       :   {type: String},
    name        :   {typpe: String},
    // todo: should action contain trigger? this way we can decide whether cycle complete should show up on the trigger modal.
    // todo: (commonly known as the alert modal, but essentially user is creating/enabling the triggers)
    action      :   [{
        id          :   {type : String},
        property    :   {type : String},
        value       :   {type : String},
        encoding    :   {type : String} // todo: how to think about this?
    }],
    trigger     :   TriggerSchema
});

/** Command **/
var CommandSchema = new Mongoose.Schema({
    command_id              :   {type: String, required: [true, 'Every command needs an id']},
    command_string          :   {type: String},
    command_params          :   [{
        cmd_param   :   {type: String}, // param name, should match exactly with the one used in the command_string 'ab{cmd_param}\r'
        default_val :   MixType,
        param_min   :   {type: Number},
        param_max   :   {type: Number}
    }],
    cmd_description         :   {type: String},
    sample_response         :   {type: String},
    sample_response_final   :   {type: String},
    filter                  :   FilterSchema,
    returns                 :   [{name: String}], // should match the feed's name
    timeout                 :   {type: Number}, // if there is no timeout, global.timeout will be used
    pre_process_func        :   {type: String},
    post_process_func       :   {type: String},
    priority                :   {type: Number, default: 3, enum: [1,2,3]} // todo: how many levels of priority?
});

/** Feed **/
var FeedSchema = new Mongoose.Schema({
    name                    :   {type: String, required: [true, 'Every parameter must have an id']},
    display_name            :   {type: String}, // for display
    unit                    :   {type: String, enum: [availableUnits]},
    color                   :   {type: String, enum: [availableColors]},
    trigger                 :   TriggerSchema
});

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


/** Driver **/
var DriverSchema = new Mongoose.Schema({
    // ref to instrument model
    instrument      :   {type: ObjectId, ref: 'Instrument'},

    tOrg            :   {type: String},
    communication : {
        serial      :   SerialComSchema,
        bash        :   ''     // todo: bash script and also allow bash script to take parameter
    },
    global          :   {
        delimiter   :   {type: String},
        timeout     :   {type: Number, default:1, min: 0.1}
    },
    sensors         :   [SensorSchema],
    feeds           :   [FeedSchema],
    commands        :   [CommandSchema],
    unsolicited     :   {   // todo: how to combine unsolicited and command-driven, or it's ok to separate them for now?
        sample_response_files   :   [{type:String}],
        filters                 :   [FilterSchema]
    },
    ui              :   UISchema,

    trigger         :   [TriggerSchema],
    // random stuff
    other           :   MixType,


    // todo: use descriminator/sub class
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



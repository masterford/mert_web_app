var config = require('./config.js');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');

// note: your host/port number may be different!
// mongoose.connect(`mongodb://localhost:${config.portNumber}/mongodb`);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:${config.portNumber}/mongodb');

var Schema = mongoose.Schema;

var UserSchema = new Schema( {
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: false},
    requests: {type: Array, default:[], required: true}
} );

var EmployeeSchema = new Schema( {
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: false},
    organization: {type: String, required: true, unique: false},
} );

EmployeeSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

EmployeeSchema.statics.authenticate = function (username, password, organization, callback) {
    Employee.findOne({ username : username, organization : organization })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function (err, result) {
                //success
                if (result === true) {
                    return callback(null, user);
                } else { //failure
                    return callback();
                }
            })
        });
}
var Employee = mongoose.model('Employee', EmployeeSchema);
var RequestSchema = new Schema( {
      id: {type: Number, required: true, unique: true},
      type: {type: String, required:true},
      date: {type: Date, required: true},
      latitude: {type: Number, required: true},
      longitude: {type: Number, required: true},
      status: {type: Number, required: true},
      phoneNumber: Number
    } );

var IdTrackerSchema = new Schema( {
    name: {type: String, required: true, unique: true},
    id: {type: Number, required: true, unique: true}
});

module.exports = {
                Employee : mongoose.model('Employee', EmployeeSchema),
                User : mongoose.model('User', UserSchema),
                Request : mongoose.model('Request', RequestSchema),
                Id: mongoose.model('Id', IdTrackerSchema)
                };

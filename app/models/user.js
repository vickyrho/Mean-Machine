var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// user schema //

var UserSchema = new Schema({
    name:String,
    username: {type: String, required:true },
    password: {type: String, required:true }
});

// hash and save //

UserSchema.pre('save',function (next) {
    var user = this ;
    if(!user.isModified('password'))
        return next();

    bcrypt.hash(user.password,null,null,function(err,hash){
        if(err)
            return next(err);
        user.password = hash ;
        next();
    })
});

// compare given password with database password //

UserSchema.methods.comparePassword = function(password){
    var user = this;

    return bcrypt.compareSync(password,user.password);
};

module.exports = mongoose.model('User',UserSchema);
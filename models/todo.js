var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


var todo = mongoose.Schema({
    text:String,
    location:String,
    date:Date,
    done:Boolean
});

var TodoSchema = mongoose.Schema({
        email        : String,
        password     : String,
        token:   String,
        provider : String, 
        todo: [todo]

});

TodoSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

TodoSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Todo', TodoSchema);

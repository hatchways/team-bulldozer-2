const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileSchema = new Schema({
    language : String,
    experienceYears : Number,
    level : Number
  });

const userSchema =  Schema({
    email : {
        type: String, 
        required : true,
        unique: true,
        lowercase: true
    },
    firstName : {
        type: String,
        required : true
    },
    lastName : {
        type: String,
        required : true
    },
    password :  {
        type: String,
        required : true
    },
    profile : { type: profileSchema}
});

module.exports = mongoose.model('User', userSchema);
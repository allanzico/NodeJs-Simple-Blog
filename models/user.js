const mongoose = require('mongoose');

//User registration schema

let userSchema = new mongoose.Schema({
name:{
    type:String,
    required:true
},

email:{
    type:String,
    required:true
},

username:{
    type:String,
    required:true
},

password:{
    type:String,
    required:true
}
});

//Export Model for use outside this file
let user = module.exports = mongoose.model('User', userSchema);

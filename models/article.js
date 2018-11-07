const mongoose = require('mongoose');

//Article schema

let articleSchema = new mongoose.Schema({

    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    }
});

//Export Model for use outside this file
let Article = module.exports = mongoose.model('Article', articleSchema);
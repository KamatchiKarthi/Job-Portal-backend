const mongoose = require('mongoose');

const  companySchema = new mongoose.Schema({
    name : {type : String, required : true},
    description : {type : String, required : true},
    website : {type : String},
    logo : {type : String},
    location : {type : String},
    industry : {type : String},
    employees : {type : String},
    users : {type : mongoose.SchemaTypes.ObjectId , ref : 'Users' ,required : true, unique : true},
    createdAt : {type : Date , default : Date.now}
})

module.exports = mongoose.model('company', companySchema)
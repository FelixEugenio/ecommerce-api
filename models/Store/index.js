const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const StoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    cnpj: {
        type: String,
        required: [true, 'CNPJ is required'],
        unique: true
    },
    email: {
        type:{type:String},
        required: [true, 'Email is required'],
        unique: true
    },
    address: {
        type: {
            place: { type: String, required: true },
        number: { type: String, required: true },
        complement: { type: String },
        neighborhood: { type: String, required: true},
        city: { type: String, required: true },
        CEP: { type: String, required: true },
        },
        required: true
        
    },
    phone: {    
        type: String,
        required: true
    },
   
},{timestamps: true});  

StoreSchema.plugin(uniqueValidator,{message: 'is already taken'});

module.exports = mongoose.model('store', StoreSchema)
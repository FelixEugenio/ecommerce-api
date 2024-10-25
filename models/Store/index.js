const mogoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const StoreSchema = new mogoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        index:true,
    },
   
    phone: {
        type: String,
        required: [true, 'Phone is required']
    },
    address: {
        type: {
            street: {type: String, required: [true, 'Street is required']},
            number: {type: String, required: [true, 'Number is required']},
            complement: {type: String},
            neighborhood: {type: String, required: [true, 'Neighborhood is required']},
            city: {type: String, required: [true, 'City is required']},
            CEP: {type: String, required: [true, 'CEP is required']},
        },
        required: true, 
    },
    cnpj: {
        type: String,
        required: [true, 'CNPJ is required'],
        unique: true
    },
},{timestamps: true});

StoreSchema.plugin(uniqueValidator,{message:"Is Already in Use"});

module.exports = mongoose.model('store', StoreSchema)
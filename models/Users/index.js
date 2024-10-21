const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { match } = require('assert');
const { token } = require('morgan');
const secret = require('../../config').secret;

const UserSchema = new mongoose.Schema({
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
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loja',
        required: [true, 'Loja is required']
    },
    permissions: {
        type: Array,
        default: ['cliente'],
    },
    hash: String,
    salt: String,
    recover: {
        type:{
            token: String,
            date: Date
        } ,
        default: {}
    },
},{timestamps: true});

//Fazendo pluguins para validação de email duplicado
UserSchema.plugin(uniqueValidator, {
    message: 'is already taken'
});

//Criando função para criptografar a senha
UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
}

//Criando função para comparar a senha
UserSchema.methods.validPassword = function(password){
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000,512, 'sha512').toString('hex');
    return hash === this.hash;
}

//gerando token de autenticação
UserSchema.methods.generateJWT = function(){
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 15);

    return jwt.sign({
        id: this._id,
        name: this.name,
        email: this.email,
        exp: parseInt(exp.getTime() / 1000,10),
    }, secret);
}

//Gerando JSON de autenticação
UserSchema.methods.toAuthJSON = function(){
    return {
        _id: this._id,
        name: this.name,
        email: this.email,
        permissions: this.permissions,
        shop: this.shop,
        token: this.generateJWT()
    }
}

//criar token de recuperação de senha
UserSchema.methods.generateRecoverToken = function(){
    this.recovery = {}
    this.recovery.token = crypto.randomBytes(16).toString('hex');
    this.recovery.date = new Date(new Date().getTime() + 24*60*60*1000);
    return this.recovery
}

//finalizar token de recuperação de senha
UserSchema.methods.finishRecoverToken = function(){
    this.recovery = {token: null, date: null}
    return this.recovery
}

module.exports = mongoose.model('users', UserSchema)
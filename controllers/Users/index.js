const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('users');
const jwt = require('jsonwebtoken');
const secret = require('../../config').secret;
const sendEmailRecovery = require('').sendEmailRecovery;

class UserController {
    //Get
     index(req, res,next) {
       User.findById(req.payload.id).then(user => {
           if(!user) return res.status(401).json({message: 'User not registered'});
           return res.json({user: user.toAuthJSON()});
       }).catch(next);
    }

    //Get /:id
    show(req, res, next) {
        User.findById(req.params.id).populate('shop')
        .then(user => {
            if(!user) return res.status(401).json({message: 'User not registered'});
            return res.json({user: {
                name: user.name,
                email: user.email,
                shop: user.shop,
                permissions: user.permissions,
            }});
        }).catch(next);
    }

    //Post /register
     store(req, res, next) {
        const {name , email, password} = req.body;

        if(!email || !password || !name) return res.status(422).json({message: 'Auth failed'});
        
        const user = new User({name, email});
          user.setPassword(password);

        user.save().then(() => {
            return res.json({user: user.toAuthJSON()});
        }).catch(next);
    }

    //Put
     update(req, res, next) {
        const {name, email, password} = req.body;
         User.findById(req.payload.id).then(user => {
             if(!user) return res.status(401).json({message: 'User not registered'});
             if(typeof name !== 'undefined') user.name = name;
             if(typeof email !== 'undefined') user.email = email;
             if(typeof password !== 'undefined') user.setPassword(password);

             return user.save().then(() => {
                 return res.json({user: user.toAuthJSON()});
             })
        }).catch(next);
    }

    //Delete
     destroy(req, res, next) {
        User.findById(req.payload.id).then(user => {
            if(!user) return res.status(401).json({message: 'User not registered'});
            return user.remove().then(() => {
                return res.json({message: 'User deleted'});
            })
        }).catch(next);
    }

    //Login
    login(req, res, next) {
        const {email, password} = req.body;
        if(!email || !password) return res.status(422).json({message: 'Auth failed'});
        User.findOne({email}, function(err, user) {
            if(!user) return res.status(401).json({message: 'User not registered'});
            if(!user.validPassword(password)) return res.status(401).json({message: 'Wrong password'});
            return res.json({user: user.toAuthJSON()});
        }).catch(next);
    }

    //Recovery password , POST para recuperacao de senha
    showRecovery(req, res, next) {
        const {email} = req.body;
        if(!email) return res.status(422).json({message: 'Email required'});
        User.findOne({email}, function(err, user) {
            if(!user) return res.status(401).json({message: 'User not registered'});
            const recoveryData = user.generateRecovery();
            return user.save().then(() => {
                return res.render('recovery', {err:null,sucess:true});
            }).catch(next);
        }).catch(next);
    }

    // GET / Password-recovered quando o usuario ja tiver com o Token
    showCompleteRecovery(req, res, next) {
        if(!req.query.token) return res.render('recovery', {err:'Token not identified',sucess:null});
        User.findOne({'recovery.token': req.query.token}).then(user => {
            if(!user) return res.render('recovery', {err:'Token not identified',sucess:null});
            if(new Date(user.recovery.date) < new Date()) return res.render('recovery', {err:'Token expired',sucess:null});
            return res.render('recovery/store', {err:null,sucess:null});
        }).catch(next);
    }

    //POST senha recuperada
    CompleteRecovery(req, res, next) {
        const {token, password} = req.body;
        if(!token || !password) return res.render('recovery/store', {err:'Token not identified',sucess:null});
        User.findOne({'recovery.token': token}).then(user => {
            if(!user) return res.render('recovery/store', {err:'Token not identified',sucess:null});
            user.finishRecoverToken();
            user.setPassword(password);
            return user.save().then(() => {
                return res.render('recovery/store', {err:null,sucess: 'Senha alterada com sucesso!.Tente fazer login',token:null});
            }).catch(next);
        }).catch(next);
    }
}

module.exports = new UserController();
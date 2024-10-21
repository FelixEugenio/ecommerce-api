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
}

module.exports = new UserController();
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

        const User = new User({name, email});
          User.setPassword(password);

        User.save().then(() => {
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
}

module.exports = new UserController();
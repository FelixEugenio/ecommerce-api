const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('users');
const jwt = require('jsonwebtoken');
const secret = require('../../config').secret;
const sendEmailRecovery = require('../../helpers/email-recovery');
class UserController {
    // Get all users
    index = (req, res, next) => {
        User.findById(req.payload.id)
            .then(user => {
                if (!user) return res.status(401).json({ message: 'User not registered' });
                return res.json({ user: user.toAuthJSON() });
            })
            .catch(next);
    }

    // Get user by ID
    show(req, res, next){
        User.findById(req.params.id)
        //.populate({ path: "store" })
        .then(user => {
            if(!user) return res.status(401).json({ errors: "User not registered" });
            return res.json({
                user: {
                    name: user.name,
                    email: user.email,
                    permissions: user.permissions,
                    store: user.store
                }
            });
        }).catch(next);
    }

    // Register a new user
    store = (req, res, next) => {
        const { name, email, password ,store} = req.body;
       
        if (!email || !password || !name || !store) return res.status(422).json({ message: 'Please, fill in all fields' });

        const user = new User({ name, email ,store });
        user.setPassword(password);

        user.save()
            .then(() => res.json({ user: user.toAuthJSON() }))
            .catch(next);
    }

    // Update user details
    update = (req, res, next) => {
        const { name, email, password } = req.body;
        User.findById(req.payload.id)
            .then(user => {
                if (!user) return res.status(401).json({ message: 'User not registered' });
                if (typeof name !== 'undefined') user.name = name;
                if (typeof email !== 'undefined') user.email = email;
                if (typeof password !== 'undefined') user.setPassword(password);

                return user.save().then(() => res.json({ user: user.toAuthJSON() }));
            })
            .catch(next);
    }

    // Delete user
    remove(req, res, next){
        User.findById(req.payload.id).then(user => {
            if(!user) return res.status(401).json({ errors: "User not registered" });
            return user.deleteOne()
            .then(() => {
                return res.json({ deletado: true });
            }).catch(next);
        }).catch(next);
    }

    // User login
    login(req, res, next){
        const { email, password } = req.body;
        User.findOne({ email }).then((user) => {
            if(!user) return res.status(401).json({ errors: "User not registered" });
            if(!user.validPassword(password)) return res.status(401).json({ errors: "Invalid password" });
            return res.json({ user: user.toAuthJSON() });
        }).catch(next);
    }

    //
    showRecovery(req, res, next) {  
        return res.render('recovery', { err: null, success: null });
    }

    // create recovery password page
    createRecovery = (req, res, next) => {
        const { email } = req.body;
        if (!email) return res.status(422).json({ message: 'Email required' });

        User.findOne({ email }, (err, user) => {
            if (!user) return res.status(401).json({ message: 'User not registered' });
            const recoveryData = user.generateRecoverToken();
            return user.save().then(() => 
                sendEmailRecovery({user,recovery: recoveryData},(err = null, success = null) => {
                    return res.render('recovery', { err, success })
                })
            ).catch(next);
        }).catch(next);
    }

    // Show complete recovery page
    showCompleteRecovery = (req, res, next) => {
        if (!req.query.token) return res.render('recovery', { err: 'Token not identified', success: null });

        User.findOne({ 'recover.token': req.query.token })
            .then(user => {
                if (!user) return res.render('recovery', { err: 'Token not identified', success: null });
                if (new Date(user.recover.date) < new Date()) return res.render('recovery', { err: 'Token expired', success: null });
                return res.render('recovery/store', { err: null, success: null });
            })
            .catch(next);
    }

    // Complete password recovery
    CompleteRecovery = (req, res, next) => {
        const { token, password } = req.body;
        if (!token || !password) return res.render('recovery/store', { err: 'Token not identified', success: null });

        User.findOne({ 'recover.token': token })
            .then(user => {
                if (!user) return res.render('recovery/store', { err: 'Token not identified', success: null });
                user.finishRecoverToken();
                user.setPassword(password);
                return user.save().then(() => {
                    return res.render('recovery/store', { err: null, success: 'Senha alterada com sucesso! Tente fazer login', token: null });
                }).catch(next);
            }).catch(next);
    }
}

module.exports = UserController;

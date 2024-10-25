const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('users');
const jwt = require('jsonwebtoken');
const secret = require('../../config').secret;
const sendEmailRecovery = require('../../helpers/email-recovery');
class UserController {
    // Get all users
    index(req,res,next){
        Store.find({  }).select("_id name cnpj email phone address")
        .then(stores => res.send({ stores }))
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
    createRecovery(req, res, next){
        const { email } = req.body;
        if(!email) return res.render('recovery', { error: "Please, fill in all fields", success: null });

        User.findOne({ email }).then((user) => {
            if(!user) return res.render("recovery", { error: "not exist user", success: null });
            const recoveryData = user.generateRecoveryToken();
            return user.save().then(() => {
                sendEmailRecovery({ user, recovery: recoveryData }, (error = null, success = null) => {
                    return res.render("recovery", { error, success });
                });
            }).catch(next);
        }).catch(next);
    }

    // Show complete recovery page
    showCompleteRecovery(req, res, next){
        if(!req.query.token) return res.render("recovery", { error: "Token não identificado", success: null });
        User.findOne({ "recovery.token": req.query.token }).then(user => {
            if(!user) return res.render("recovery", { error: "Não existe usuário com este token", success: null });
            if( new Date(user.recovery.date) < new Date() ) return res.render("recovery", { error: "Token expirado. Tente novamente.", success: null });
            return res.render("recovery/store", { error: null, success: null, token: req.query.token });
        }).catch(next);
    }

    // Complete password recovery
    completeRecovery(req, res, next){
        const { token, password } = req.body;
        if(!token || !password) return res.render("recovery/store", { error: "Preencha novamente com sua nova senha", success: null, token: token });
        User.findOne({ "recovery.token": token }).then(user => {
            if(!user) return res.render("recovery", { error: "Usuario nao identificado", success: null });

            user.finishRecoverToken();
            user.setPassword(password);
            return user.save().then(() => {
                return res.render("recovery/store", {
                    error: null,
                    success: "Senha alterada com sucesso. Tente novamente fazer login.",
                    token: null
                });
            }).catch(next);
        });
    }
}

module.exports = UserController;

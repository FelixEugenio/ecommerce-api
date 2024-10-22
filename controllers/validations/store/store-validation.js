const mongoose = require('mongoose');
const User = mongoose.model('users');
const Store = mongoose.model('stores');


module.exports = (req, res, next) => {
    if(!req.payload.id) return res.sendStatus(401);
    next();
    const {store} = req.query;
    if(!store) return res.sendStatus(401)
        User.findById(req.payload.id).then(user => {
            if(!user) return res.sendStatus(401);
            if(!user.store) return res.sendStatus(401);
            if(!user.permissions.includes('admin')) return res.sendStatus(401);
            if(user.store != store) return res.sendStatus(401);
            next();
        });
}

module.exports = storeValidation;

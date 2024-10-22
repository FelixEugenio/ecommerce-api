const mongoose = require('mongoose');
const User = mongoose.model('users');
const Store = mongoose.model('stores');

const storeValidation = (req, res, next) => {
    if (!req.payload.id) {
        return res.sendStatus(401);
    }

    const { store } = req.query;
    if (!store) {
        return res.sendStatus(401);
    }

    User.findById(req.payload.id).then(user => {
        if (!user) {
            return res.sendStatus(401);
        }
        if (!user.store) {
            return res.sendStatus(401);
        }
        if (!user.permissions.includes('admin')) {
            return res.sendStatus(401);
        }
        if (user.store.toString() !== store) {
            return res.sendStatus(401);
        }

        // If all checks pass, proceed to the next middleware
        next();
    }).catch(err => {
        console.error(err);
        return res.sendStatus(500); // Handle any potential errors
    });
}

module.exports = storeValidation;

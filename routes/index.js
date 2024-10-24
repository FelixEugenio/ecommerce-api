const router  = require('express').Router();

router.use('/v1/api', require('./api/v1'));
router.get('/', (req, res,next) => res.send('Ecommerce API'));

router.use((err,req, res, next) => {
    if(err.name === 'ValidationError'){
        return res.status(422).json({ 
            errors: Object.keys(err.errors).reduce((errors, key) => {
                errors[key] = err.errors[key].message;
                return errors;
            }, {})
        });
    }
    return res.status(err.status || 500).json({
        error: {
            message: err.message,
            status: err.status
        }
        })

        return next(err);
});

module.exports = router;
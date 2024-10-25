const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/stores', require('./store'));

module.exports = router;
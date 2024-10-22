const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/store', require('./store'));

module.exports = router;
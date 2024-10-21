const router = require('express').Router();
const User = require('../../../models/Users');
const auth = require('../../auth');
const UserController = require('../../../controllers');

const UserController = new UserController();

router.get('/', auth.required, UserController.index);
router.get('/:id', auth.required, UserController.show);

router.post('/login', UserController.login);
router.post('/register', UserController.store);
router.put('/', auth.required, UserController.update);
router.delete('/', auth.required, UserController.destroy);

router.get('/recovery-password', UserController.showRecovery);
router.post('/recovery-password', UserController.createRecovery);
router.get('/password-recovered/', UserController.showCompleteRecovery);
router.post('/password-recovered', UserController.CompleteRecovery);

module.exports = router;


const router = require('express').Router();
const auth = require('../../auth');
const UserController = require('../../../controllers/Users');

const userController = new UserController();

router.get('/', auth.required, userController.index);
router.get('/:id', auth.required, userController.show);

router.post('/login', userController.login);
router.post('/register', userController.store);
router.put('/', auth.required, userController.update);
router.delete('/', auth.required, userController.destroy);

router.get('/recovery-password', userController.showRecovery);
router.post('/recovery-password', userController.createRecovery);
router.get('/password-recovered/', userController.showCompleteRecovery);
router.post('/password-recovered', userController.CompleteRecovery);

module.exports = router;


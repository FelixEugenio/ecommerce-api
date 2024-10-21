const router = require('express').Router();
const auth = require('../../auth');
const UserController = require('../../../controllers/Users');

const userController = new UserController();



router.post('/login', userController.login);//testado
router.post('/register', userController.store);//testado
router.put('/', auth.required, userController.update);
router.delete('/', auth.required, userController.destroy);

router.get('/recovery-password', userController.showRecovery);
router.post('/recovery-password', userController.createRecovery);
router.get('/password-recovered', userController.showCompleteRecovery);
router.post('/password-recovered', userController.CompleteRecovery);

router.get('/', auth.required, userController.index);
router.get('/:id', auth.required, userController.show);

module.exports = router;


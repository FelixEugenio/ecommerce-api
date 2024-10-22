const router = require('express').Router();
const auth = require('../../auth');
const storeValidation = require('../../../controllers/validations/store/store-validation');
const StoreController = require('../../../controllers/Users');

const storeController = new StoreController();

router.get('/', storeController.index);
router.get('/:id', storeController.show);
router.post('/', auth.required, storeValidation ,storeController.store);
router.put('/:id', auth.required,storeValidation , storeController.update);
router.delete('/:id', auth.required,storeValidation , storeController.remove);

module.exports = router;


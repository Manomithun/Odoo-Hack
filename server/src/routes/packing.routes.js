const express = require('express');
const router = express.Router();
const { updateItem, deleteItem } = require('../controllers/packing.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { updatePackingItemSchema } = require('../validations/packing.validation');

router.use(authMiddleware);
router.put('/:id', validate(updatePackingItemSchema), updateItem);
router.delete('/:id', deleteItem);

module.exports = router;

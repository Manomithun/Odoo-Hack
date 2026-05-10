const express = require('express');
const router = express.Router();
const { deleteBudgetEntry } = require('../controllers/budget.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.use(authMiddleware);
router.delete('/:id', deleteBudgetEntry);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getPlatformStats, getAllUsers } = require('../controllers/admin.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');

router.use(authMiddleware, adminMiddleware);
router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);

module.exports = router;

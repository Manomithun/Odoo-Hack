const express = require('express');
const router = express.Router();
const { deleteNote } = require('../controllers/note.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.use(authMiddleware);
router.delete('/:id', deleteNote);

module.exports = router;

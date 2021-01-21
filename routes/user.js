require('dotenv').config();
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user')
const auth = require('../middlewares/auth')

router.post('/register', userController.register)
router.post('/login', userController.login);
router.get('/:id',[auth], userController.detail)
router.get('/', userController.getAll)

module.exports = router;
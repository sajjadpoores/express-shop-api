require('dotenv').config();
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user')
const auth = require('../middlewares/auth')
const permission = require('../middlewares/permission')

router.post('/register', userController.register)
router.post('/login', userController.login);
router.get('/:id',[auth, permission('addUser', true)], userController.detail)
router.get('/', userController.getAll)

module.exports = router;
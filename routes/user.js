const express = require('express')
const router = express.Router()

const UserModel = require('../models/user')

router.post('/register', async (req, res) => {
     const newUser = new UserModel(req.body)
     await newUser.save()
     res.send(newUser)
})


module.exports = router
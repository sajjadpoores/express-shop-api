require('dotenv').config()

const express = require('express')
const router = express.Router()

const UserModel = require('../models/user')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function hashPassowrd(password) {
     const salt = await bcrypt.genSalt(10)
     const hash = await bcrypt.hash(password, salt)
     return hash
}

router.post('/register', async (req, res) => {
     req.body.password = await hashPassowrd(req.body.password)
     const newUser = new UserModel(req.body)
     await newUser.save()
     res.send(newUser)
})

router.post('/login', async (req, res) => {
     const {email, phone, password} = req.body
     const foundUser = await UserModel.findOne({$or: [{email}, {phone}]})
     if(foundUser) {
          const passwordIsCorrect = await bcrypt.compare(password, foundUser.password)
          if(passwordIsCorrect) {
               const token = jwt.sign({_id: foundUser._id, name: foundUser.name}, process.env.PASSWORD_HASH_KEY)
               return res.send(token)
          }
     }
     return res.send('false')
})


module.exports = router
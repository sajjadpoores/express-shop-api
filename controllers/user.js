const { model: UserModel, validate: validateUser } = require('../models/user');
const jwt = require('jsonwebtoken')
const {model: PermissionModel} = require('../models/permission')
const { createDefaultPermission, removeFieldFromDocument, extractFieldsFromObject } = require('../utilities/helpers')
module.exports = {
    register: async function (req, res) {
        const data = extractFieldsFromObject(req.body, ['name', 'password', 'email', 'phone'])
        
        const userValidation = validateUser(data);
        if (userValidation.error) {
            return res.status(400).send(userValidation.error.details.map(detail => detail.message));
        }

        if(data.email) {
            const userExists = await UserModel.findOne({email: data.email})
            if(userExists) {
                return res.status(409).send(['An account with such email is already registered'])
            }
        }
        
        if(data.phone) {
            const userExists = await UserModel.findOne({phone: data.phone})
            if(userExists) {
                return res.status(409).send(['An account with such phone is already registered'])
            }
        }

        let normalUserPermission = await PermissionModel.findOne({name: 'normal user'})
        if(!normalUserPermission) {  
            normalUserPermission = await createDefaultPermission()
}
        data.permission = normalUserPermission._id
        const newUser = new UserModel(data);
        try {
            await newUser.save();
            return res.send(removeFieldFromDocument(newUser, ['password']));
        }
        catch (error) {
            console.log(error)
            res.status(500).send(['something went wrong!']);
        }
    },
    login: async function (req, res) {
        const { email, phone, password } = req.body;
        const foundUser = await UserModel.findOne({ $or: [{ email }, { phone }] });
        if (foundUser) {
            const passwordIsCorrect = await foundUser.checkPassword(password)
            if (passwordIsCorrect) {
                const token = jwt.sign({ _id: foundUser._id, name: foundUser.name }, process.env.PASSWORD_HASH_KEY);
                return res.send(token);
            }
            else {
                return res.send(['wrong password'])
            }
        }
        return res.send(['user not found']);
    },
    detail: async function(req, res) {       
        const foundUser = await UserModel.findById(req.params.id)
        if(foundUser) {
            return res.send(removeFieldFromDocument(foundUser,['password']))
        }
        return res.status(404).send(['Could not find user with given ID'])
    },
    getAll: async function (req, res) {
        const users = await UserModel.find()
        if(users) {
            return res.send(users.map(user => removeFieldFromDocument(user, ['password'])))
        }
        return res.status(500).send(['something went wrong!'])
    }
}
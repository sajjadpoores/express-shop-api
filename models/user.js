const mongoose = require('mongoose');
const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity").default;
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 100,
        required: true
    },
    email: {
        type: String,
        minlength: 3,
        maxlength: 320,
        required: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        index: { unique: true, dropDups: true }
    },
    phone: {
        type: String,
        minlength: 11,
        maxlength: 11,
        required: true,
        match: /09(1[0-9]|3[1-9]|2[1-9])-?[0-9]{3}-?[0-9]{4}/,
        index: { unique: true, dropDups: true }
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 60,
        required: true
    },
    favoriteProducts: [{
        type: mongoose.Types.ObjectId,
        ref: "product",
    }],
    favoriteArticles: [{
        type: mongoose.Types.ObjectId,
        ref: "article",
    }],
    favoriteBlogs: [{
        type: mongoose.Types.ObjectId,
        ref: "blog",
    }],
    permission: {
        type: mongoose.Types.ObjectId,
        ref: "permission",
        required: true
    },
    baskets: [{
        type: mongoose.Types.ObjectId,
        ref: "basket"
    }],
    avatar: {
        type: mongoose.Types.ObjectId,
        ref: "image",
        required: false,
        minlength: 3,
        maxlength: 300
    },
    optometry: {
        type: mongoose.Types.ObjectId,
        ref: "image",
        required: false,
        minlength: 3,
        maxlength: 300
    },
    insurance: {
        type: mongoose.Types.ObjectId,
        ref: "image",
        required: false,
        minlength: 3,
        maxlength: 300
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true
    }
});

async function hashPassowrd(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    user.password = await hashPassowrd(user.password);
    next();
});

userSchema.methods.checkPassword = async function (password, cb) {
    console.log(password, this.password);
    return await bcrypt.compare(password, this.password);
};

function validateUser(user) {
    const complexityOptions = {
        min: 6,
        max: 30,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 2,
    };

    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().min(3).max(320).required().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        phone: Joi.string().min(11).max(11).required().pattern(/09(1[0-9]|3[1-9]|2[1-9])-?[0-9]{3}-?[0-9]{4}/),
        password: passwordComplexity(complexityOptions).required()
    });

    return schema.validate(user);
}

const UserModel = mongoose.model('User', userSchema);
module.exports = { UserModel, validateUser };
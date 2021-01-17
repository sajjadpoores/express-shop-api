const mongoose = require('mongoose')

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
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    phone: {
        type: String,
        minlength: 11,
        maxlength: 11,
        required: true,
        match: /09(1[0-9]|3[1-9]|2[1-9])-?[0-9]{3}-?[0-9]{4}/
    },
    password: {
        type: String,
        minlength: 60,
        maxlength: 60,
        required: true
    }
})
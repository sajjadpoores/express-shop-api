const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { Schema } = mongoose

const ImageModel = mongoose.model('image', new Schema ({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 300
    },
    url: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 300
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'image-category'
     },
}))

function validateImage(image) {
    const JoiSchema = Joi.object({
       name: Joi.string().min(3).max(300).required(),
       category: Joi.objectId().required()
    })
    
    return JoiSchema.validate(image)
 }

 module.exports = {
    model: ImageModel,
    validate: validateImage
 }
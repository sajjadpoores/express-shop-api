const mongoose = require('mongoose')
const Joi = require('joi');
const { Schema } = mongoose

const PropertyModel = mongoose.model('property', new Schema({
   name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 300
   },
}))

function validateProperty(property) {
   const JoiSchema = Joi.object({
      name: Joi.string().min(3).max(300).required(),
   })
   
   return JoiSchema.validate(property)
}

module.exports = {
   model: PropertyModel,
   validate: validateProperty
}
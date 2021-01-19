const mongoose = require('mongoose')
const Joi = require('joi');
const { Schema } = mongoose

const ConfigModel = mongoose.model('config', new Schema({
   key: {
      type: String,
      required: true,
      minlength: 3
   },
   value: {
      type: String,
      required: false,
      minlength: 0,
      default: ""
   }
}))


function validateConfig(category) {
   const JoiSchema = Joi.object({
      key: Joi.string().min(3).max(300).required(),
      value: Joi.string().allow('')
   })

   return JoiSchema.validate(category)
}

module.exports =  {
   model: ConfigModel,
   validate: validateConfig,
}
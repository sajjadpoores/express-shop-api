const mongoose = require('mongoose')
const Joi = require('joi');
const { Schema } = mongoose

const ImageCategory = mongoose.model('image-category', new Schema({
   name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 300,
      unique: true,
      dropDups: true
   }
}))

function validateImageCategory(imageCategory) {
   const JoiSchema = Joi.object({
      name: Joi.string().min(3).max(300).required(),
   })
   
   return JoiSchema.validate(imageCategory)
}
module.exports =  {
   model: ImageCategory,
   validate: validateImageCategory,
}
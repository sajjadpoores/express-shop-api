const mongoose = require('mongoose')
const Joi = require('joi');
const { Schema } = mongoose

const CategoryModel = mongoose.model('category', new Schema({
   name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 300,
      unique: true,
      dropDups: true
   }
}))

function validateCategory(category) {
   const JoiSchema = Joi.object({
      name: Joi.string().min(3).max(300).required(),
   })
   
   return JoiSchema.validate(category)
}
module.exports =  {
   model: CategoryModel,
   validate: validateCategory,
}
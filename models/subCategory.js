const mongoose = require('mongoose')
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const { Schema } = mongoose

const SubCategoryModel = mongoose.model('sub-category', new Schema({
   name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 300,
      unique: true,
      dropDups: true
   },
   parent: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: true
   }
}))

function validateSubCategory(subCategory) {
   const JoiSchema = Joi.object({
      name: Joi.string().min(3).max(300).required(),
      parent: Joi.objectId().required()
   })
   
   return JoiSchema.validate(subCategory)
}
module.exports =  {
   model: SubCategoryModel,
   validate: validateSubCategory,
}
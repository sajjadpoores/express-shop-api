const mongoose = require('mongoose')
const Joi = require('joi')
const { Schema } = mongoose

const BlogTagModel = mongoose.model('blog-tag', new Schema({
   name: {
      type: String,
      required: true,
      minlength: 3
   }
}))

function validateBlogTag(blogTag) {
   const JoiSchema = Joi.object({
      name: Joi.string().min(3).required()
   })
   
   return JoiSchema.validate(blogTag)
}

module.exports = { 
   model: BlogTagModel,
   validate: validateBlogTag
}
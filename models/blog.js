const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { Schema } = mongoose

const BlogModel = mongoose.model('blog', new Schema({
   title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 300
   },
   text: {
      type: String,
      required: true,
      minlength: 10
   },
   author: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true
   },
   date: {
      type: Date,
      default: Date.now(),
      required: true
   },
   tags: [{
      type: mongoose.Types.ObjectId,
      ref: 'blog-tag',
      required: false
   }]
}))


function validateBlog(article) {
   const JoiSchema = Joi.object({
      title: Joi.string().min(3).max(300).required(),
      text: Joi.string().min(10).required(),
      author: Joi.objectId().required(),
      date: Joi.date(), // not required
      tags: Joi.array().items(Joi.objectId()).unique()
   })
   
   return JoiSchema.validate(article)
}
module.exports = {
   model: BlogModel,
   validate: validateBlog
} 
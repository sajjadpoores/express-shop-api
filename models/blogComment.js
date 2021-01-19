const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { Schema } = mongoose

const BlogCommentModel = mongoose.model('blog-comment', new Schema ({
   blog: {
      type: mongoose.Types.ObjectId,
      ref: "blog",
      required: true
   },
   user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true
   },
   text: {
      type: String,
      required: true
   },
   date: {
      type: Date,
      default: Date.now(),
      required: true
   },
   replyTo: {
      type: mongoose.Types.ObjectId,
      ref: 'blog-comment',
      required: false,
      default: null
   },
   isApproved: {
      type: Boolean,
      default: false
   }
}))

function validateBlogComment(articleComment) {
   const JoiSchema = Joi.object({
      blog: Joi.objectId().required(),
      user: Joi.objectId().required(),
      text: Joi.string().required().min(3),
      date: Joi.date(), // not required
      replyTo: Joi.objectId() // not required
   })
   
   return JoiSchema.validate(articleComment)
}

module.exports = {
   model: BlogCommentModel,
   validate: validateBlogComment
}
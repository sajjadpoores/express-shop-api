const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { Schema } = mongoose

const ArticleCommentModel = mongoose.model('article-comment', new Schema ({
   article: {
      type: mongoose.Types.ObjectId,
      ref: "article",
      required: true
   },
   user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true
   },
   text: {
      type: String,
      required: true,
      minlength: 3
   },
   date: {
      type: Date,
      default: Date.now(),
      required: true
   },
   replyTo: {
      type: mongoose.Types.ObjectId,
      ref: 'article-comment',
      required: false,
      default: null
   },
   isApproved: {
      type: Boolean,
      default: false
   }
}))

function validateArticleComment(articleComment) {
   const JoiSchema = Joi.object({
      article: Joi.objectId().required(),
      user: Joi.objectId().required(),
      text: Joi.string().required().min(3),
      date: Joi.date(), // not required
      replyTo: Joi.objectId(), // not required
      isApproved: Joi.boolean().default(false) // not required but false initially
   })
   
   return JoiSchema.validate(articleComment)
}

module.exports = {
   model: ArticleCommentModel,
   validate: validateArticleComment
}
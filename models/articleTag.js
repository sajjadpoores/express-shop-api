const mongoose = require('mongoose')
const Joi = require('joi')
const { Schema } = mongoose

const ArticleTagModel = mongoose.model('article-tag', new Schema({
   name: {
      type: String,
      required: true,
      minlength: 3
   }
}))

function validateArticleTag(articleTag) {
   const JoiSchema = Joi.object({
      name: Joi.string().min(3).required()
   })
   
   return JoiSchema.validate(articleTag)
}

module.exports = { 
   model: ArticleTagModel,
   validate: validateArticleTag
}
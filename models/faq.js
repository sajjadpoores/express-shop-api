const mongoose = require('mongoose')
const Joi = require('joi');
const { Schema } = mongoose

const FaqModel = mongoose.model('faq', new Schema({
   question: {
      type: String,
      required: true,
      minlength: 3
   },
   answer: {
      type: String,
      required: true,
   }
}))


function validateConfig(faq) {
   const JoiSchema = Joi.object({
      question: Joi.string().min(3).max(1000).required(),
      answer: Joi.string().min(3).max(10000).required()
   })

   return JoiSchema.validate(faq)
}

module.exports =  {
   model: FaqModel,
   validate: validateConfig,
}
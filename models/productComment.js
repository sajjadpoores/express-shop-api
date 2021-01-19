const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { Schema } = mongoose


const ProductCommentModel = mongoose.model('product-comment', new Schema ({
   product: {
      type: mongoose.Types.ObjectId,
      ref: "product",
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
      ref: 'product-comment',
      required: false,
      default: null
   },
   isApproved: {
      type: Boolean,
      default: false
   }
}))

function validateProductComment(productComment) {
   const JoiSchema = Joi.object({
      product: Joi.objectId().required(),
      user: Joi.objectId().required(),
      text: Joi.string().required().min(3),
      date: Joi.date(), // not required
      replyTo: Joi.objectId(), // not required
      isApproved: Joi.boolean().default(false) // not required but false initially
   })
   
   return JoiSchema.validate(productComment)
}

module.exports = {
   model: ProductCommentModel,
   validate: validateProductComment
}
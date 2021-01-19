const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { Schema } = mongoose

const BasketModel = mongoose.model('basket', new Schema({
   products: [{
      type: mongoose.Types.ObjectId,
      ref: "product",
      required: true
   }],
   status: {
      type: Number,
      default: 0,
   },
   payment: {
      type: mongoose.Types.ObjectId,
      ref: "payment"
   }
}))


function validateBasket(basket) {
   const JoiSchema = Joi.object({
      products: Joi.array().items(Joi.objectId()).unique(),
      status: Joi.number().min(0),
      payment: Joi.objectId()
   })
   
   return JoiSchema.validate(basket)
}

module.exports = {
   model: BasketModel,
   validate: validateBasket
}
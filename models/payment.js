const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')
const { Schema } = mongoose

const PaymentModel = mongoose.model('payment', new Schema({
   date: {
      type: Date,
      default: Date.now(),
      required: true
   },
   serialNumber: {
      type: Number,
      required: true
   },
   status: {
      type: Number,
      required: true,
      min: 0
   },
   discount: {
      type: mongoose.Types.ObjectId,
      ref: "discount"
   }
}))


function validatePayment(payment) {
   const JoiSchema = Joi.object({
      date: Joi.date(),
      serialNumber: Joi.number().required(),
      status: Joi.number().required().min(0),
      discount: Joi.objectId()
   })
   
   return JoiSchema.validate(payment)
}

module.exports = {
   model: PaymentModel,
   validate: validatePayment
}
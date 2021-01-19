const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { Schema } = mongoose

const TicketModel = mongoose.model('ticket', new Schema({
   // who is sending the ticket message
   user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      required: true
   },
   date: {
      type: Date,
      default: Date.now(),
      required: true
   },
   // to which user admin is replying (if this field is not empty, admin is the sender)
   repliedToUser: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      required: false
   },
   text: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 1024
   }
}))

function validateTicket(basket) {
   const JoiSchema = Joi.object({
      user: Joi.objectId().required(),
      date: Joi.date(),
      repliedToUser: Joi.objectId(),
      text: Joi.string().min(3).max(1024).required()
   })
   
   return JoiSchema.validate(basket)
}

module.exports = {
   model: TicketModel,
   validate: validateTicket
}
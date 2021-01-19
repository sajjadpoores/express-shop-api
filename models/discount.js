const mongoose = require('mongoose')
const Joi = require('joi');
const joiObjectid = require('joi-objectid');
Joi.objectId = require('joi-objectid')(Joi)
const { Schema } = mongoose

const DiscountModel = mongoose.model('discount', new Schema({
   name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 300
   },
   code: {
      type: String,
      minlength: 3,
      required: false
   },
   amount: {
      type: Number,
      min: 0,
      required: true
   },
   unit: {
      type: String,
      enum: ['percent', 'toman'],
      required: true,
      default: 'percent'
   },
   isEnabled: {
      type: Boolean,
      default: true
   },
   type: {
      type: String,
      default: 'user',
      required: true,
      enum: ['user', 'all', 'some', 'category']
   },
   category: {
      type: mongoose.Types.ObjectId,
      required: function() { return this.type === 'category' },
      ref: "category"
   },
   products: [{
      type: mongoose.Types.ObjectId,
      required: function() { return this.type === 'some' },
      ref: "product"
   }]
}))


function validateDiscount(discount) {
   const JoiSchema = Joi.object({
      name: Joi.string().min(3).max(300).required(),
      endDate: Joi.date(),
      code: Joi.string().min(3),
      amount: Joi.number().min(0).required(),
      unit: Joi.string().valid('percent', 'toman'),
      isEnabled: Joi.boolean(),
      type: Joi.string().required().valid('user', 'all', 'some', 'category'),
      category: Joi.objectId().when('type', {is: 'category', then: Joi.objectId().required()}),
      products: Joi.array().items(Joi.objectId()).unique().when('type', {is: 'some', then: Joi.required()}),
   })

   if((discount.products || discount.category ) && (discount.type === 'all' || discount.type === 'user')) {
      return {
         error: {
            details: [
               {
                  message: `products and category should not be sent when type is set to ${discount.type}`
               }
            ]
         }
      }
   }
   else if(discount.category && discount.type === 'some') {
      return {
         error: {
            details: [
               {
                  message: `category should not be sent when type is set to ${discount.type}`
               }
            ]
         }
      }
   }
   else if(discount.products && discount.type === 'category') {
      return {
         error: {
            details: [
               {
                  message: `category should not be sent when type is set to ${discount.type}`
               }
            ]
         }
      }
   }

   return JoiSchema.validate(discount)
}

module.exports =  {
   model: DiscountModel,
   validate: validateDiscount,
}
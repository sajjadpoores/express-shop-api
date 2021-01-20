const mongoose = require('mongoose')
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const { Schema } = mongoose

const ProductModel = mongoose.model('product', new Schema({
   name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 300
   },
   price: {
      type: Number,
      required: true,
      default: 0
   },
   categories: [{
      type: mongoose.Types.ObjectId,
      ref: 'sub-category'
   }],
   properties: [{
      property: [{
         type: mongoose.Types.ObjectId,
         ref: 'property'
      }],
      value: {
         type: String,
      }
   }],
   images: [{
      type: mongoose.Types.ObjectId,
      ref: 'image'
   }],
   colors: [{
      type: String,
      minlength: 6,
      maxlength: 7
   }],
   count: {
      type: Number,
      required: true,
      default: 0,
      min: 0
   },
   rate: {
      count: {
         type: Number,
         min: 0,
         default: 0
      },
      average: {
         type: Number,
         min: 0,
         max: 6,
         default: 0
      },
      users: [
         {
            user: {
               type: mongoose.Types.ObjectId,
               ref: "user"
            },
            rate: {
               type: Number,
               min: 0,
               max: 6
            }
         }
      ]
   }
}))


function validateProduct(product) {
   const JoiSchema = Joi.object({
      name: Joi.string().min(3).max(300),
      price: Joi.number().min(0),
      categories: Joi.array().items(Joi.objectId()).unique().required().min(1),
      properties: Joi.array().items({
         property: Joi.objectId().required(),
         value: Joi.string().required()
      }).unique(),
     images: Joi.array().items(Joi.objectId()).unique(),
     colors: Joi.array().items(Joi.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/)).unique(),
     count: Joi.number().min(0).required(),
   })
   return JoiSchema.validate(product)
}

function validateRate(rate) {
   const JoiSchema = Joi.object({
      rate: Joi.number().min(0).max(6).required()
   })

   return JoiSchema.validate(rate)
}

module.exports = {
   model: ProductModel,
   validate: validateProduct,
   validateRate
}
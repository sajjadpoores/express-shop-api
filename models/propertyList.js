const mongoose = require('mongoose')
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const { Schema } = mongoose

const PropertyListModel = mongoose.model('property-list', new Schema({
   name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 300
   },
   properties: {
      type: [mongoose.Types.ObjectId],
      ref: 'property',
      required: true,
      default: []
   }
}))

function validatePropertyList(propertyList) {
   const JoiSchema = Joi.object({
      name: Joi.string().min(3).max(300).required(),
      properties: Joi.array().items(Joi.objectId()).unique().min(1).required()
   })

   return JoiSchema.validate(propertyList)
}

module.exports = {
   model: PropertyListModel,
   validate: validatePropertyList
}
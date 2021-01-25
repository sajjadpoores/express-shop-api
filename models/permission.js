const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const PermissionModel = mongoose.model(
  "permission",
  new Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 300,
    },
    writeArticle: {
      type: Boolean,
      required: true,
      default: false,
    },
    writeArticleComment: {
      type: Boolean,
      required: true,
      default: true,
    },
    writeBlog: {
      type: Boolean,
      required: true,
      default: false,
    },
    writeBlogComment: {
      type: Boolean,
      required: true,
      default: true,
    },
    addProduct: {
      type: Boolean,
      required: true,
      default: false,
    },
    addCategory: {
      type: Boolean,
      required: true,
      default: false,
    },
    addDiscount: {
      type: Boolean,
      required: true,
      default: false,
    },
    addProperty: {
      type: Boolean,
      required: true,
      default: false,
    },
    addConfig: {
      type: Boolean,
      required: true,
      default: false,
    },
    addFaq: {
      type: Boolean,
      required: true,
      default: false,
    },
    addImage: {
      type: Boolean,
      required: true,
      default: false,
    },
    addPermission: {
      type: Boolean,
      required: true,
      default: false,
    },
    addTicket: {
      type: Boolean,
      required: true,
      default: false,
    },
    addUser: {
      type: Boolean,
      required: true,
      default: false,
    },
    addPayment: {
      type: Boolean,
      required: true,
      default: false,
    },
  })
);

function validatePermission(permission) {
  const JoiSchema = Joi.object({
    name: Joi.string().min(3).max(300).required(),
    writeArticle: Joi.boolean(),
    writeArticleComment: Joi.boolean(),
    writeBlog: Joi.boolean(),
    writeBlogComment: Joi.boolean(),
    addProduct: Joi.boolean(),
    addCategory: Joi.boolean(),
    addDiscount: Joi.boolean(),
    addProperty: Joi.boolean(),
    addConfig: Joi.boolean(),
    addFaq: Joi.boolean(),
    addImage: Joi.boolean(),
    addPermission: Joi.boolean(),
    addTicket: Joi.boolean(),
    addUser: Joi.boolean(),
    addPayment: Joi.boolean(),
  });
  return JoiSchema.validate(permission);
}

module.exports = {
  model: PermissionModel,
  validate: validatePermission,
};

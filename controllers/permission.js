const {
  model: PermissionModel,
  validate: validatePermission,
} = require("../models/permission");

const { extractFieldsFromObject } = require("../utilities/helpers");

module.exports = {
  create: async function (req, res) {
    const { error } = validatePermission(
      extractFieldsFromObject(req.body, [
        "name",
        "writeArticle",
        "writeArticleComment",
        "writeBlog",
        "writeBlogComment",
        "addProduct",
        "addCategory",
        "addDiscount",
        "addProperty",
        "addConfig",
        "addFaq",
        "addImage",
        "addPermission",
        "addTicket",
        "addUser",
        "addPayment",
      ])
    );
    if (error) return res.status(400).send(error.details[0].message);
    const permission = new PermissionModel(
      extractFieldsFromObject(req.body, [
        "name",
        "writeArticle",
        "writeArticleComment",
        "writeBlog",
        "writeBlogComment",
        "addProduct",
        "addCategory",
        "addDiscount",
        "addProperty",
        "addConfig",
        "addFaq",
        "addImage",
        "addPermission",
        "addTicket",
        "addUser",
        "addPayment",
      ])
    );
    await permission.save();
    return res
      .status(200)
      .send(
        extractFieldsFromObject(permission, [
          "name",
          "writeArticle",
          "writeArticleComment",
          "writeBlog",
          "writeBlogComment",
          "addProduct",
          "addCategory",
          "addDiscount",
          "addProperty",
          "addConfig",
          "addFaq",
          "addImage",
          "addPermission",
          "addTicket",
          "addUser",
          "addPayment",
          "_id",
        ])
      );
  },
  detail: async function (req, res) {
    const permission = await PermissionModel.findById(req.params.id);
    if (!permission)
      return res.status(404).send("Permission with given ID was not found!");
    return res
      .status(200)
      .send(
        extractFieldsFromObject(permission, [
          "_id",
          "name",
          "writeArticle",
          "writeArticleComment",
          "writeBlog",
          "writeBlogComment",
          "addProduct",
          "addCategory",
          "addDiscount",
          "addProperty",
          "addConfig",
          "addFaq",
          "addImage",
          "addPermission",
          "addTicket",
          "addUser",
          "addPayment",
        ])
      );
  },
  getAll: async function (req, res) {
    const permissions = await PermissionModel.find();
    return res
      .status(200)
      .send(
        permissions.map((item) =>
          extractFieldsFromObject(item, [
            "_id",
            "name",
            "writeArticle",
            "writeArticleComment",
            "writeBlog",
            "writeBlogComment",
            "addProduct",
            "addCategory",
            "addDiscount",
            "addProperty",
            "addConfig",
            "addFaq",
            "addImage",
            "addPermission",
            "addTicket",
            "addUser",
            "addPayment",
          ])
        )
      );
  },
  update: async function (req, res) {
    const permission = await PermissionModel.findById(req.params.id);
    if (!permission)
      return res.status(404).send("Permission with given ID was not found!");

    const permissionObject = extractFieldsFromObject(req.body, [
      "name",
      "writeArticle",
      "writeArticleComment",
      "writeBlog",
      "writeBlogComment",
      "addProduct",
      "addCategory",
      "addDiscount",
      "addProperty",
      "addConfig",
      "addFaq",
      "addImage",
      "addPermission",
      "addTicket",
      "addUser",
      "addPayment",
    ]);

    const { error } = validatePermission(permissionObject);
    if (error) return res.status(400).send(error.details[0].message);

    await PermissionModel.findOneAndUpdate(
      { _id: req.params.id },
      permissionObject
    );
    const updatedPermission = await PermissionModel.findById(req.params.id);
    res
      .status(200)
      .send(
        extractFieldsFromObject(updatedPermission, [
          "name",
          "writeArticle",
          "writeArticleComment",
          "writeBlog",
          "writeBlogComment",
          "addProduct",
          "addCategory",
          "addDiscount",
          "addProperty",
          "addConfig",
          "addFaq",
          "addImage",
          "addPermission",
          "addTicket",
          "addUser",
          "addPayment",
        ])
      );
  },
  delete: async function (req, res) {
    const permission = await PermissionModel.findById(req.params.id);
    if (!permission)
      return res.status(404).send("Permission with given ID was not found!");
    await PermissionModel.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send(
        extractFieldsFromObject(permission, [
          "name",
          "writeArticle",
          "writeArticleComment",
          "writeBlog",
          "writeBlogComment",
          "addProduct",
          "addCategory",
          "addDiscount",
          "addProperty",
          "addConfig",
          "addFaq",
          "addImage",
          "addPermission",
          "addTicket",
          "addUser",
          "addPayment",
          "_id",
        ])
      );
  },
};

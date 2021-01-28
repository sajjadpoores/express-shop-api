const {
  model: ProductCommentModel,
  validate: validateProductComment,
} = require("../models/productComment");
const { model: ProductModel } = require("../models/product");
const { model: UserModel } = require("../models/user");

const { extractFieldsFromObject } = require("../utilities/helpers");

module.exports = {
  create: async function (req, res) {
    // set user from request
    req.body.user = req.user._id;

    const { error } = validateProductComment(
      extractFieldsFromObject(req.body, ["product", "user", "text", "date", "replyTo"])
    );
    if (error) return res.status(400).send(error.details[0].message);

    // check product existance
    const product = await ProductModel.findById(req.body.product);
    if (!product) return res.status(404).send("Product couldnt be found...");

    // check user existance
    const user = await UserModel.findById(req.body.user);
    if (!user) return res.status(404).send("User couldnt be found...");

    // check replyTo user existance
    if (req.body.replyTo) {
      const replyToComment = await ProductCommentModel.findById(
        req.body.replyTo
      );
      if (!replyToComment)
        return res.status(404).send("ReplyTo comment couldnt be found...");
    }

    const productComment = new ProductCommentModel(
      extractFieldsFromObject(req.body, [
        "product",
        "user",
        "text",
        "date",
        "replyTo",
        "isApproved",
      ])
    );
    await productComment.save();

    const savedProductComment = await ProductCommentModel.findById(
      productComment._id
    ).populate([
      { path: "product", populate: { path: "properties.property" } },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    return res
      .status(200)
      .send(
        extractFieldsFromObject(savedProductComment, [
          "product",
          "user",
          "text",
          "date",
          "replyTo",
          "isApproved",
          "_id",
        ])
      );
  },
  detail: async function (req, res) {
    const productComment = await ProductCommentModel.findById(
      req.params.id
    ).populate([
      { path: "product", populate: { path: "properties.property" } },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    if (!productComment)
      return res
        .status(404)
        .send("Product comment with given ID was not found!");
    return res
      .status(200)
      .send(
        extractFieldsFromObject(productComment, [
          "product",
          "user",
          "text",
          "date",
          "replyTo",
          "isApproved",
          "_id",
        ])
      );
  },
  getAll: async function (req, res) {
    const productComments = await ProductCommentModel.find().populate([
      { path: "product", populate: { path: "properties.property" } },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    return res
      .status(200)
      .send(
        productComments.map((item) =>
          extractFieldsFromObject(item, [
            "product",
            "user",
            "text",
            "date",
            "replyTo",
            "isApproved",
            "_id",
          ])
        )
      );
  },
  update: async function (req, res) {
    const productComment = await ProductCommentModel.findById(req.params.id);
    if (!productComment)
      return res
        .status(404)
        .send("Product comment with given ID was not found!");

    const productCommentObject = extractFieldsFromObject(req.body, [
      "product",
      "user",
      "text",
      "date",
      "replyTo",
    ]);

    const { error } = validateProductComment(productCommentObject);
    if (error) return res.status(400).send(error.details[0].message);

    if (req.body.replyTo === req.params.id) {
      return res.status(405).send("ReplyTo: Reference to self is not allowed.");
    }
    // check product existance
    const product = await ProductModel.findById(req.body.product);
    if (!product) return res.status(404).send("Product couldnt be found...");

    // check user existance
    const user = await UserModel.findById(req.body.user);
    if (!user) return res.status(404).send("User couldnt be found...");

    // check replyTo user existance
    if (req.body.replyTo) {
      const replyToComment = await ProductCommentModel.findById(
        req.body.replyTo
      );
      if (!replyToComment)
        return res.status(404).send("ReplyTo comment couldnt be found...");
    }

    await ProductCommentModel.findByIdAndUpdate(
      req.params.id,
      productCommentObject
    );
    const updatedProductComment = await ProductCommentModel.findById(
      req.params.id
    ).populate([
      { path: "product", populate: { path: "properties.property" } },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    res.status(200).send(updatedProductComment);
  },
  delete: async function (req, res) {
    const productComment = await ProductCommentModel.findById(
      req.params.id
    ).populate([
      { path: "product", populate: { path: "properties.property" } },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    if (!productComment)
      return res
        .status(404)
        .send("Product comment with given ID was not found!");
    await ProductCommentModel.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send(
        extractFieldsFromObject(productComment, [
          "product",
          "user",
          "text",
          "date",
          "replyTo",
          "isApproved",
          "_id",
        ])
      );
  },
  approve: async function (req, res) {
    const productComment = await ProductCommentModel.findById(
      req.params.id
    ).populate([
      { path: "product", populate: { path: "properties.property" } },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    if (!productComment)
      return res
        .status(404)
        .send("Product comment with given ID was not found!");

    productComment.isApproved = true;
    await productComment.save();
    return res
      .status(200)
      .send(
        extractFieldsFromObject(productComment, [
          "product",
          "user",
          "text",
          "date",
          "replyTo",
          "isApproved",
          "_id",
        ])
      );
  },
  disapprove: async function (req, res) {
    const productComment = await ProductCommentModel.findById(
      req.params.id
    ).populate([
      { path: "product", populate: { path: "properties.property" } },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    if (!productComment)
      return res
        .status(404)
        .send("Product comment with given ID was not found!");

    productComment.isApproved = false;
    await productComment.save();
    return res
      .status(200)
      .send(
        extractFieldsFromObject(productComment, [
          "product",
          "user",
          "text",
          "date",
          "replyTo",
          "isApproved",
          "_id",
        ])
      );
  },
};

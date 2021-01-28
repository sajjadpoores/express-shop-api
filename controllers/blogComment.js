const {
  model: BlogCommentModel,
  validate: validateBlogComment,
} = require("../models/blogComment");
const { model: BlogModel } = require("../models/blog");
const { model: UserModel } = require("../models/user");
const { extractFieldsFromObject } = require("../utilities/helpers");

module.exports = {
  create: async function (req, res) {
    const { error } = validateBlogComment(
      extractFieldsFromObject(req.body, [
        "blog",
        "user",
        "text",
        "date",
        "replyTo",
      ])
    );
    if (error) return res.status(400).send(error.details[0].message);

    // check blog existance
    const blog = await BlogModel.findById(req.body.blog);
    if (!blog) return res.status(404).send("Blog couldnt be found...");

    // check user existance
    const user = await UserModel.findById(req.body.user);
    if (!user) return res.status(404).send("User couldnt be found...");

    // check replyTo user existance
    if (req.body.replyTo) {
      const replyToComment = await BlogCommentModel.findById(req.body.replyTo);
      if (!replyToComment)
        return res.status(404).send("ReplyTo comment couldnt be found...");
    }

    const blogComment = new BlogCommentModel(
      extractFieldsFromObject(req.body, [
        "blog",
        "user",
        "text",
        "date",
        "replyTo",
        "isApproved",
      ])
    );
    await blogComment.save();

    const savedBlogComment = await BlogCommentModel.findById(
      blogComment._id
    ).populate([
      { path: "blog" },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    return res
      .status(200)
      .send(
        extractFieldsFromObject(savedBlogComment, [
          "blog",
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
    const blogComment = await BlogCommentModel.findById(
      req.params.id
    ).populate([
      { path: "blog" },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    if (!blogComment)
      return res.status(404).send("Blog comment with given ID was not found!");
    return res
      .status(200)
      .send(
        extractFieldsFromObject(blogComment, [
          "blog",
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
    const blogComments = await BlogCommentModel.find().populate([
      { path: "blog" },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    return res
      .status(200)
      .send(
        blogComments.map((item) =>
          extractFieldsFromObject(item, [
            "blog",
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
    const blogComment = await BlogCommentModel.findById(req.params.id);
    if (!blogComment)
      return res.status(404).send("Blog comment with given ID was not found!");

    const blogCommentObject = extractFieldsFromObject(req.body, [
      "blog",
      "user",
      "text",
      "date",
      "replyTo",
    ]);

    const { error } = validateBlogComment(blogCommentObject);
    if (error) return res.status(400).send(error.details[0].message);

    // check blog existance
    const blog = await BlogModel.findById(req.body.blog);
    if (!blog) return res.status(404).send("Blog couldnt be found...");

    // check user existance
    const user = await UserModel.findById(req.body.user);
    if (!user) return res.status(404).send("User couldnt be found...");

    // check replyTo user existance
    if (req.body.replyTo) {
      const replyToComment = await BlogCommentModel.findById(req.body.replyTo);
      if (!replyToComment)
        return res.status(404).send("ReplyTo comment couldnt be found...");
    }

    await BlogCommentModel.findByIdAndUpdate(req.params.id, blogCommentObject);
    const updatedBlogComment = await BlogCommentModel.findById(
      req.params.id
    ).populate([
      { path: "blog" },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    res.status(200).send(updatedBlogComment);
  },
  delete: async function (req, res) {
    const property = await BlogCommentModel.findById(req.params.id).populate([
      { path: "blog" },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    if (!property)
      return res.status(404).send("Blog comment with given ID was not found!");
    await BlogCommentModel.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send(
        extractFieldsFromObject(property, [
          "blog",
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
    const blogComment = await BlogCommentModel.findById(
      req.params.id
    ).populate([
      { path: "product", populate: { path: "properties.property" } },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    if (!blogComment)
      return res
        .status(404)
        .send("Article comment with given ID was not found!");

    blogComment.isApproved = true;
    await blogComment.save();
    return res
      .status(200)
      .send(
        extractFieldsFromObject(blogComment, [
          "Article",
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
    const blogComment = await BlogCommentModel.findById(
      req.params.id
    ).populate([
      { path: "product", populate: { path: "properties.property" } },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    if (!blogComment)
      return res
        .status(404)
        .send("Article comment with given ID was not found!");

    blogComment.isApproved = false;
    await blogComment.save();
    return res
      .status(200)
      .send(
        extractFieldsFromObject(blogComment, [
          "article",
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
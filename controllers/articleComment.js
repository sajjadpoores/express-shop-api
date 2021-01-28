const {
  model: ArticleCommentModel,
  validate: validateArticleComment,
} = require("../models/articleComment");
const { model: ArticleModel } = require("../models/article");
const { model: UserModel } = require("../models/user");
const { extractFieldsFromObject } = require("../utilities/helpers");

module.exports = {
  create: async function (req, res) {
    // set user from request
    req.body.user = req.user._id;

    const { error } = validateArticleComment(
      extractFieldsFromObject(req.body, ["article", "user", "text", "date", "replyTo"])
    );
    if (error) return res.status(400).send(error.details[0].message);

    // check article existance
    const article = await ArticleModel.findById(req.body.article);
    if (!article) return res.status(404).send("Article couldnt be found...");

    // check user existance
    const user = await UserModel.findById(req.body.user);
    if (!user) return res.status(404).send("User couldnt be found...");

    // check replyTo user existance
    if (req.body.replyTo) {
      const replyToComment = await ArticleCommentModel.findById(
        req.body.replyTo
      );
      if (!replyToComment)
        return res.status(404).send("ReplyTo comment couldnt be found...");
    }

    const articleComment = new ArticleCommentModel(
      extractFieldsFromObject(req.body, [
        "article",
        "user",
        "text",
        "date",
        "replyTo",
        "isApproved",
      ])
    );
    await articleComment.save();

    const savedArticleComment = await ArticleCommentModel.findById(
      articleComment._id
    ).populate([
      { path: "article" },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    return res
      .status(200)
      .send(
        extractFieldsFromObject(savedArticleComment, [
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
  detail: async function (req, res) {
    const articleComment = await ArticleCommentModel.findById(
      req.params.id
    ).populate([
      { path: "article" },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    if (!articleComment)
      return res
        .status(404)
        .send("Article comment with given ID was not found!");
    return res
      .status(200)
      .send(
        extractFieldsFromObject(articleComment, [
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
  getAll: async function (req, res) {
    const articleComments = await ArticleCommentModel.find().populate([
      { path: "article" },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    return res
      .status(200)
      .send(
        articleComments.map((item) =>
          extractFieldsFromObject(item, [
            "article",
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
    const articleComment = await ArticleCommentModel.findById(req.params.id);
    if (!articleComment)
      return res
        .status(404)
        .send("Article comment with given ID was not found!");

    const articleCommentObject = extractFieldsFromObject(req.body, [
      "article",
      "user",
      "text",
      "date",
      "replyTo",
    ]);

    const { error } = validateArticleComment(articleCommentObject);
    if (error) return res.status(400).send(error.details[0].message);

    // check article existance
    const article = await ArticleModel.findById(req.body.article);
    if (!article) return res.status(404).send("Article couldnt be found...");

    // check user existance
    const user = await UserModel.findById(req.body.user);
    if (!user) return res.status(404).send("User couldnt be found...");

    // check replyTo user existance
    if (req.body.replyTo) {
      const replyToComment = await ArticleCommentModel.findById(
        req.body.replyTo
      );
      if (!replyToComment)
        return res.status(404).send("ReplyTo comment couldnt be found...");
    }

    await ArticleCommentModel.findByIdAndUpdate(
      req.params.id,
      articleCommentObject
    );
    const updatedArticleComment = await ArticleCommentModel.findById(
      req.params.id
    ).populate([
      { path: "article" },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    res.status(200).send(updatedArticleComment);
  },
  delete: async function (req, res) {
    const property = await ArticleCommentModel.findById(
      req.params.id
    ).populate([
      { path: "article" },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    if (!property)
      return res
        .status(404)
        .send("Article comment with given ID was not found!");
    await ArticleCommentModel.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send(
        extractFieldsFromObject(property, [
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
  approve: async function (req, res) {
    const articleComment = await ArticleCommentModel.findById(
      req.params.id
    ).populate([
      { path: "product", populate: { path: "properties.property" } },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    if (!articleComment)
      return res
        .status(404)
        .send("Article comment with given ID was not found!");

    articleComment.isApproved = true;
    await articleComment.save();
    return res
      .status(200)
      .send(
        extractFieldsFromObject(articleComment, [
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
    const articleComment = await ArticleCommentModel.findById(
      req.params.id
    ).populate([
      { path: "product", populate: { path: "properties.property" } },
      { path: "user", select: "-password" },
      { path: "replyTo" },
    ]);
    if (!articleComment)
      return res
        .status(404)
        .send("Article comment with given ID was not found!");

    articleComment.isApproved = false;
    await articleComment.save();
    return res
      .status(200)
      .send(
        extractFieldsFromObject(articleComment, [
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

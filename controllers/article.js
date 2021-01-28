const {
  model: ArticleModel,
  validate: validateArticle,
} = require("../models/article");
const { model: ArticleTagModel } = require("../models/articleTag");
const { model: UserModel } = require("../models/user");
const { extractFieldsFromObject } = require("../utilities/helpers");

module.exports = {
  create: async function (req, res) {
    const { error } = validateArticle(
      extractFieldsFromObject(req.body, [
        "title",
        "text",
        "author",
        "date",
        "tags",
      ])
    );
    if (error) return res.status(400).send(error.details[0].message);

    // check tag existance
    for (let tag of req.body.tags) {
      const tagExists = await ArticleTagModel.findById(tag);
      if (!tagExists) {
        return res
          .status(404)
          .send("one or more of provided tags couldnt be found...");
      }
    }

    const article = new ArticleModel(
      extractFieldsFromObject(req.body, [
        "title",
        "text",
        "author",
        "date",
        "tags",
      ])
    );
    await article.save();

    const savedArticle = await ArticleModel.findById(article._id).populate([
      { path: "author", select: "-password", populate: { path: "permission" } },
      { path: "tags" },
    ]);
    return res
      .status(200)
      .send(
        extractFieldsFromObject(savedArticle, [
          "title",
          "text",
          "author",
          "date",
          "tags",
          "_id",
        ])
      );
  },
  detail: async function (req, res) {
    const article = await ArticleModel.findById(req.params.id).populate([
      { path: "author", select: "-password", populate: { path: "permission" } },
      { path: "tags" },
    ]);
    if (!article)
      return res.status(404).send("Article with given ID was not found!");
    return res
      .status(200)
      .send(
        extractFieldsFromObject(article, [
          "title",
          "text",
          "author",
          "date",
          "tags",
          "_id",
        ])
      );
  },
  getAll: async function (req, res) {
    const articles = await ArticleModel.find().populate([
      { path: "author", select: "-password", populate: { path: "permission" } },
      { path: "tags" },
    ]);
    return res
      .status(200)
      .send(
        articles.map((item) =>
          extractFieldsFromObject(item, [
            "title",
            "text",
            "author",
            "date",
            "tags",
            "_id",
          ])
        )
      );
  },
  update: async function (req, res) {
    const article = await ArticleModel.findById(req.params.id);
    if (!article)
      return res.status(404).send("Article with given ID was not found!");

    const articleObject = extractFieldsFromObject(req.body, [
      "title",
      "text",
      "author",
      "date",
      "tags",
    ]);

    const { error } = validateArticle(articleObject);
    if (error) return res.status(400).send(error.details[0].message);

    // check tag existance
    for (let tag of req.body.tags) {
      const tagExists = await ArticleTagModel.findById(tag);
      if (!tagExists) {
        return res
          .status(404)
          .send("one or more of provided tags couldnt be found...");
      }
    }

    await ArticleModel.findByIdAndUpdate(req.params.id, articleObject);
    const updatedArticle = await ArticleModel.findById(req.params.id).populate([
      { path: "author", select: "-password", populate: { path: "permission" } },
      { path: "tags" },
    ]);
    res.status(200).send(updatedArticle);
  },
  delete: async function (req, res) {
    const article = await ArticleModel.findById(req.params.id).populate([
      { path: "author", select: "-password", populate: { path: "permission" } },
      { path: "tags" },
    ]);
    if (!article)
      return res.status(404).send("Article with given ID was not found!");
    await ArticleModel.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send(
        extractFieldsFromObject(article, [
          "title",
          "text",
          "author",
          "date",
          "tags",
          "_id",
        ])
      );
  },
  like: async function (req, res) {
    const article = await ArticleModel.findById(req.params.id).populate([
      { path: "author", select: "-password", populate: { path: "permission" } },
      { path: "tags" },
    ]);
    if (!article)
      return res.status(404).send("Article with given ID was not found!");

    await UserModel.findByIdAndUpdate(req.user, {
      $addToSet: { favoriteArticles: article._id },
    });
    const user = await UserModel.findById(req.user).populate([
      { path: "favoriteProducts" },
      { path: "favoriteArticles" },
      { path: "favoriteBlogs" },
    ]);
    return res
      .status(200)
      .send(extractFieldsFromObject(user, ["_id", "favoriteArticles"]));
  },
  unlike: async function (req, res) {
    const article = await ArticleModel.findById(req.params.id).populate([
      { path: "author", select: "-password", populate: { path: "permission" } },
      { path: "tags" },
    ]);
    if (!article)
      return res.status(404).send("Article with given ID was not found!");

    await UserModel.findByIdAndUpdate(req.user, {
      $pull: { favoriteArticles: article._id },
    });
    const user = await UserModel.findById(req.user).populate([
      { path: "favoriteProducts" },
      { path: "favoriteArticles" },
      { path: "favoriteBlogs" },
    ]);
    return res
      .status(200)
      .send(extractFieldsFromObject(user, ["_id", "favoriteArticles"]));
  },
};

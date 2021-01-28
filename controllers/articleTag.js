const {
  model: articleTagModel,
  validate: validateArticleTag,
} = require("../models/articleTag");
const { extractFieldsFromObject } = require("../utilities/helpers");

module.exports = {
  create: async function (req, res) {
    const { error } = validateArticleTag(extractFieldsFromObject(req.body, "name"));
    if (error) return res.status(400).send(error.details[0].message);
    const articleTag = new articleTagModel(extractFieldsFromObject(req.body, "name"));
    await articleTag.save();
    return res.status(200).send(extractFieldsFromObject(articleTag, ["name", "_id"]));
  },
  detail: async function (req, res) {
    const articleTag = await articleTagModel.findById(req.params.id);
    if (!articleTag)
      return res.status(404).send("Article tag with given ID was not found!");
    return res.status(200).send(extractFieldsFromObject(articleTag, ["_id", "name"]));
  },
  getAll: async function (req, res) {
    const articleTags = await articleTagModel.find();
    return res
      .status(200)
      .send(articleTags.map((item) => extractFieldsFromObject(item, ["_id", "name"])));
  },
  update: async function (req, res) {
    const articleTag = await articleTagModel.findById(req.params.id);
    if (!articleTag)
      return res.status(404).send("Article tag with given ID was not found!");

    const articleTagObject = extractFieldsFromObject(req.body, "name");

    const { error } = validateArticleTag(articleTagObject);
    if (error) return res.status(400).send(error.details[0].message);

    await articleTagModel.findOneAndUpdate(
      { _id: req.params.id },
      articleTagObject
    );
    res.status(200).send(articleTagObject);
  },
  delete: async function (req, res) {
    const articleTag = await articleTagModel.findById(req.params.id);
    if (!articleTag)
      return res.status(404).send("Article tag with given ID was not found!");
    await articleTagModel.deleteOne({ _id: req.params.id });
    return res.status(200).send(extractFieldsFromObject(articleTag, ["name", "_id"]));
  },
};

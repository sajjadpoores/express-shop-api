const {
  model: BlogTagModel,
  validate: validateBlogTag,
} = require("../models/blogTag");
const { extractFieldsFromObject } = require("../utilities/helpers");

module.exports = {
  create: async function (req, res) {
    const { error } = validateBlogTag(
      extractFieldsFromObject(req.body, "name")
    );
    if (error) return res.status(400).send(error.details[0].message);
    const blogTag = new BlogTagModel(extractFieldsFromObject(req.body, "name"));
    await blogTag.save();
    return res
      .status(200)
      .send(extractFieldsFromObject(blogTag, ["name", "_id"]));
  },
  detail: async function (req, res) {
    const blogTag = await BlogTagModel.findById(req.params.id);
    if (!blogTag)
      return res.status(404).send("Blog tag with given ID was not found!");
    return res
      .status(200)
      .send(extractFieldsFromObject(blogTag, ["_id", "name"]));
  },
  getAll: async function (req, res) {
    const blogTags = await BlogTagModel.find();
    return res
      .status(200)
      .send(
        blogTags.map((item) => extractFieldsFromObject(item, ["_id", "name"]))
      );
  },
  update: async function (req, res) {
    const blogTag = await BlogTagModel.findById(req.params.id);
    if (!blogTag)
      return res.status(404).send("Blog tag with given ID was not found!");

    const blogTagObject = extractFieldsFromObject(req.body, "name");

    const { error } = validateBlogTag(blogTagObject);
    if (error) return res.status(400).send(error.details[0].message);

    await BlogTagModel.findOneAndUpdate({ _id: req.params.id }, blogTagObject);
    res.status(200).send(blogTagObject);
  },
  delete: async function (req, res) {
    const blogTag = await BlogTagModel.findById(req.params.id);
    if (!blogTag)
      return res.status(404).send("Blog tag with given ID was not found!");
    await BlogTagModel.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send(extractFieldsFromObject(blogTag, ["name", "_id"]));
  },
};

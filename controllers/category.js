const {
  model: CategoryModel,
  validate: validateCategory,
} = require("../models/category");
const { extractFieldsFromObject } = require("../utilities/helpers");

module.exports = {
  create: async function (req, res) {
    const { error } = validateCategory(extractFieldsFromObject(req.body, "name"));
    if (error) return res.status(400).send(error.details[0].message);
    const category = new CategoryModel(extractFieldsFromObject(req.body, "name"));
    await category.save();
    return res.status(200).send(extractFieldsFromObject(category, ["name", "_id"]));
  },
  detail: async function (req, res) {
    const category = await CategoryModel.findById(req.params.id);
    if (!category)
      return res.status(404).send("Category with given ID was not found!");
    return res.status(200).send(extractFieldsFromObject(category, ["_id", "name"]));
  },
  getAll: async function (req, res) {
    const categories = await CategoryModel.find();
    return res
      .status(200)
      .send(categories.map((item) => extractFieldsFromObject(item, ["_id", "name"])));
  },
  update: async function (req, res) {
    const category = await CategoryModel.findById(req.params.id);
    if (!category)
      return res.status(404).send("Category with given ID was not found!");

    const categoryObject = extractFieldsFromObject(req.body, "name");

    const { error } = validateCategory(categoryObject);
    if (error) return res.status(400).send(error.details[0].message);

    await CategoryModel.findOneAndUpdate(
      { _id: req.params.id },
      categoryObject
    );
    res.status(200).send(categoryObject);
  },
  delete: async function (req, res) {
    const category = await CategoryModel.findById(req.params.id);
    if (!category)
      return res.status(404).send("Category with given ID was not found!");
    await CategoryModel.deleteOne({ _id: req.params.id });
    return res.status(200).send(extractFieldsFromObject(category, ["name", "_id"]));
  },
};

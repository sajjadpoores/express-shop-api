const {
  model: ImageCategory,
  validate: validateImageCategory,
} = require("../models/imageCategory");
const { extractFieldsFromObject } = require("../utilities/helpers");

module.exports = {
  create: async function (req, res) {
    const { error } = validateImageCategory(extractFieldsFromObject(req.body, "name"));
    if (error) return res.status(400).send(error.details[0].message);
    const category = new ImageCategory(extractFieldsFromObject(req.body, "name"));
    await category.save();
    return res.status(200).send(extractFieldsFromObject(category, ["name", "_id"]));
  },
  detail: async function (req, res) {
    const category = await ImageCategory.findById(req.params.id);
    if (!category)
      return res
        .status(404)
        .send("Image category with given ID was not found!");
    return res.status(200).send(extractFieldsFromObject(category, ["_id", "name"]));
  },
  getAll: async function (req, res) {
    const categories = await ImageCategory.find();
    return res
      .status(200)
      .send(categories.map((item) => extractFieldsFromObject(item, ["_id", "name"])));
  },
  update: async function (req, res) {
    const category = await ImageCategory.findById(req.params.id);
    if (!category)
      return res
        .status(404)
        .send("Image category with given ID was not found!");

    const categoryObject = extractFieldsFromObject(req.body, "name");

    const { error } = validateImageCategory(categoryObject);
    if (error) return res.status(400).send(error.details[0].message);

    await ImageCategory.findOneAndUpdate(
      { _id: req.params.id },
      categoryObject
    );
    res.status(200).send(categoryObject);
  },
  delete: async function (req, res) {
    const category = await ImageCategory.findById(req.params.id);
    if (!category)
      return res
        .status(404)
        .send("Image category with given ID was not found!");
    await ImageCategory.deleteOne({ _id: req.params.id });
    return res.status(200).send(extractFieldsFromObject(category, ["name", "_id"]));
  },
};

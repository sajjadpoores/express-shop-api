const {
  model: PropertyModel,
  validate: validateProperty,
} = require("../models/property");

const { extractFieldsFromObject } = require("../utilities/helpers");

module.exports = {
  create: async function (req, res) {
    const { error } = validateProperty(
      extractFieldsFromObject(req.body, "name")
    );
    if (error) return res.status(400).send(error.details[0].message);
    const property = new PropertyModel(
      extractFieldsFromObject(req.body, "name")
    );
    await property.save();
    return res
      .status(200)
      .send(extractFieldsFromObject(property, ["name", "_id"]));
  },
  detail: async function (req, res) {
    const property = await PropertyModel.findById(req.params.id);
    if (!property)
      return res.status(404).send("Property with given ID was not found!");
    return res
      .status(200)
      .send(extractFieldsFromObject(property, ["_id", "name"]));
  },
  getAll: async function (req, res) {
    const properties = await PropertyModel.find();
    return res
      .status(200)
      .send(
        properties.map((item) => extractFieldsFromObject(item, ["_id", "name"]))
      );
  },
  update: async function (req, res) {
    const property = await PropertyModel.findById(req.params.id);
    if (!property)
      return res.status(404).send("Property with given ID was not found!");

    const propertyObject = extractFieldsFromObject(req.body, "name");

    const { error } = validateProperty(propertyObject);
    if (error) return res.status(400).send(error.details[0].message);

    await PropertyModel.findByIdAndUpdate(req.params.id, propertyObject);
    res.status(200).send(propertyObject);
  },
  delete: async function (req, res) {
    const property = await PropertyModel.findById(req.params.id);
    if (!property)
      return res.status(404).send("Property with given ID was not found!");
    await PropertyModel.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send(extractFieldsFromObject(property, ["name", "_id"]));
  },
};

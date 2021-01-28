const {
  model: PropertyListModel,
  validate: validatePropertyList,
} = require("../models/propertyList");
const { model: PropertyModel } = require("../models/property");

const { extractFieldsFromObject } = require("../utilities/helpers");

module.exports = {
  create: async function (req, res) {
    const { error } = validatePropertyList(
      extractFieldsFromObject(req.body, ["name", "properties"])
    );
    if (error) return res.status(400).send(error.details[0].message);

    for (let property of req.body.properties) {
      const propertyIsFound = await PropertyModel.findById(property);
      if (!propertyIsFound)
        return res
          .status(404)
          .send("one or more of provided properties could not be found in DB!");
    }

    const propertyList = new PropertyListModel(
      extractFieldsFromObject(req.body, ["name", "properties"])
    );
    await propertyList.save();
    return res
      .status(200)
      .send(extractFieldsFromObject(propertyList, ["name", "properties", "_id"]));
  },
  detail: async function (req, res) {
    const property = await PropertyListModel.findById(req.params.id);
    if (!property)
      return res.status(404).send("Property-list with given ID was not found!");
    return res
      .status(200)
      .send(extractFieldsFromObject(property, ["_id", "name", "properties"]));
  },
  getAll: async function (req, res) {
    const properties = await PropertyListModel.find();
    return res
      .status(200)
      .send(
        properties.map((item) => extractFieldsFromObject(item, ["_id", "name", "properties"]))
      );
  },
  update: async function (req, res) {
    const property = await PropertyListModel.findById(req.params.id);
    if (!property)
      return res.status(404).send("Property-list with given ID was not found!");

    const propertyListObject = extractFieldsFromObject(req.body, ["name", "properties"]);

    const { error } = validatePropertyList(propertyListObject);
    if (error) return res.status(400).send(error.details[0].message);

    await PropertyListModel.findOneAndUpdate(
      { _id: req.params.id },
      propertyListObject
    );
    res.status(200).send(propertyListObject);
  },
  delete: async function (req, res) {
    const property = await PropertyListModel.findById(req.params.id);
    if (!property)
      return res.status(404).send("Property-list with given ID was not found!");
    await PropertyListModel.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send(extractFieldsFromObject(property, ["name", "properties", "_id"]));
  },
};

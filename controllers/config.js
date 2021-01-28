const {
  model: ConfigModel,
  validate: validateConfig,
} = require("../models/config");
const { extractFieldsFromObject } = require("../utilities/helpers");

module.exports = {
  create: async function (req, res) {
    const { error } = validateConfig(extractFieldsFromObject(req.body, ["key", "value"]));
    if (error) return res.status(400).send(error.details[0].message);
    const config = new ConfigModel(extractFieldsFromObject(req.body, ["key", "value"]));
    await config.save();
    return res.status(200).send(extractFieldsFromObject(config, ["key", "value", "_id"]));
  },
  detail: async function (req, res) {
    const config = await ConfigModel.findById(req.params.id);
    if (!config)
      return res.status(404).send("Config with given ID was not found!");
    return res.status(200).send(extractFieldsFromObject(config, ["key", "value", "_id"]));
  },
  getAll: async function (req, res) {
    const configs = await ConfigModel.find();
    return res
      .status(200)
      .send(configs.map((item) => extractFieldsFromObject(item, ["key", "value", "_id"])));
  },
  update: async function (req, res) {
    const config = await ConfigModel.findById(req.params.id);
    if (!config)
      return res.status(404).send("Config with given ID was not found!");

    const configObject = extractFieldsFromObject(req.body, ["key", "value"]);

    const { error } = validateConfig(configObject);
    if (error) return res.status(400).send(error.details[0].message);

    await ConfigModel.findOneAndUpdate({ _id: req.params.id }, configObject);
    res.status(200).send(configObject);
  },
  delete: async function (req, res) {
    const config = await ConfigModel.findById(req.params.id);
    if (!config)
      return res.status(404).send("Config with given ID was not found!");
    await ConfigModel.deleteOne({ _id: req.params.id });
    return res.status(200).send(extractFieldsFromObject(config, ["key", "value", "_id"]));
  },
};

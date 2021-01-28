const { model: FaqModel, validate: validateFaq } = require("../models/faq");
const { extractFieldsFromObject } = require("../utilities/helpers");

module.expors = {
  create: async function (req, res) {
    const { error } = validateFaq(
      extractFieldsFromObject(req.body, ["question", "answer"])
    );
    if (error) return res.status(400).send(error.details[0].message);
    const config = new FaqModel(
      extractFieldsFromObject(req.body, ["question", "answer"])
    );
    await config.save();
    return res
      .status(200)
      .send(extractFieldsFromObject(config, ["question", "answer", "_id"]));
  },
  detail: async function (req, res) {
    const config = await FaqModel.findById(req.params.id);
    if (!config)
      return res.status(404).send("Config with given ID was not found!");
    return res
      .status(200)
      .send(extractFieldsFromObject(config, ["question", "answer", "_id"]));
  },
  getAll: async function (req, res) {
    const configs = await FaqModel.find();
    return res
      .status(200)
      .send(
        configs.map((item) =>
          extractFieldsFromObject(item, ["question", "answer", "_id"])
        )
      );
  },
  update: async function (req, res) {
    const config = await FaqModel.findById(req.params.id);
    if (!config)
      return res.status(404).send("Config with given ID was not found!");

    const configObject = extractFieldsFromObject(req.body, [
      "question",
      "answer",
    ]);

    const { error } = validateFaq(configObject);
    if (error) return res.status(400).send(error.details[0].message);

    await FaqModel.findOneAndUpdate({ _id: req.params.id }, configObject);
    res.status(200).send(configObject);
  },
  delete: async function (req, res) {
    const config = await FaqModel.findById(req.params.id);
    if (!config)
      return res.status(404).send("Config with given ID was not found!");
    await FaqModel.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send(extractFieldsFromObject(config, ["question", "answer", "_id"]));
  },
};

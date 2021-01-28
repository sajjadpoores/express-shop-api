const {
  model: DiscountModel,
  validate: validateDiscount,
} = require("../models/discount");

const { randomString, extractFieldsFromObject } = require("../utilities/helpers");

module.exports = {
  create: async function (req, res) {
    const { error } = validateDiscount(
      extractFieldsFromObject(req.body, [
        "name",
        "code",
        "amount",
        "unit",
        "type",
        "category",
        "products",
        "isEnabled",
      ])
    );
    if (error) return res.status(400).send(error.details[0].message);

    if (req.body.type === "user") {
      req.body.code = randomString(5);
    }

    const discount = new DiscountModel(
      extractFieldsFromObject(req.body, [
        "name",
        "code",
        "amount",
        "unit",
        "type",
        "category",
        "products",
        "isEnabled",
      ])
    );
    await discount.save();

    const savedDiscount = await DiscountModel.findById(discount._id).populate([
      { path: "category" },
      { path: "products" },
    ]);
    return res
      .status(200)
      .send(
        extractFieldsFromObject(savedDiscount, [
          "name",
          "code",
          "amount",
          "unit",
          "type",
          "category",
          "products",
          "isEnabled",
          "_id",
        ])
      );
  },
  detail: async function (req, res) {
    const discount = await DiscountModel.findById(req.params.id);
    if (!discount)
      return res.status(404).send("Discount with given ID was not found!");
    return res
      .status(200)
      .send(
        extractFieldsFromObject(discount, [
          "name",
          "code",
          "amount",
          "unit",
          "type",
          "category",
          "products",
          "isEnabled",
          "_id",
        ])
      );
  },
  getAll: async function (req, res) {
    const discounts = await DiscountModel.find();
    return res
      .status(200)
      .send(
        discounts.map((item) =>
          extractFieldsFromObject(item, [
            "name",
            "code",
            "amount",
            "unit",
            "type",
            "category",
            "products",
            "isEnabled",
            "_id",
          ])
        )
      );
  },
  update: async function (req, res) {
    const discount = await DiscountModel.findById(req.params.id);
    if (!discount)
      return res.status(404).send("Discount with given ID was not found!");

    const discountObject = extractFieldsFromObject(req.body, [
      "name",
      "code",
      "amount",
      "unit",
      "type",
      "category",
      "products",
      "isEnabled",
    ]);

    const { error } = validateDiscount(discountObject);
    if (error) return res.status(400).send(error.details[0].message);

    await DiscountModel.findOneAndUpdate(
      { _id: req.params.id },
      discountObject
    );
    res.status(200).send(discountObject);
  },
  delete: async function (req, res) {
    const discount = await DiscountModel.findById(req.params.id);
    if (!discount)
      return res.status(404).send("Discount with given ID was not found!");
    await DiscountModel.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send(
        extractFieldsFromObject(discount, [
          "name",
          "code",
          "amount",
          "unit",
          "type",
          "category",
          "products",
          "isEnabled",
          "_id",
        ])
      );
  },
  enable: async function (req, res) {
    const discount = await DiscountModel.findById(req.params.id);
    if (!discount)
      return res.status(404).send("Discount with given ID was not found!");
    discount.isEnabled = true;
    await DiscountModel.findByIdAndUpdate(req.params.id, discount);
    return res.status(200).send(discount);
  },
  disable: async function (req, res) {
    const discount = await DiscountModel.findById(req.params.id);
    if (!discount)
      return res.status(404).send("Discount with given ID was not found!");
    discount.isEnabled = false;
    await DiscountModel.findByIdAndUpdate(req.params.id, discount);
    return res.status(200).send(discount);
  },
};

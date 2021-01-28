const {
  model: BasketModel,
  validate: validateBasket,
} = require("../models/basket");
const { model: ProductModel } = require("../models/product");
const { extractFieldsFromObject } = require("../utilities/helpers");

module.exports = {
  create: async function (req, res) {
    const { error } = validateBasket(
      extractFieldsFromObject(req.body, ["products", "status", "payment"])
    );
    if (error) return res.status(400).send(error.details[0].message);

    // check tag existance
    for (let product of req.body.products) {
      const productExists = await ProductModel.findById(product);
      if (!productExists) {
        return res
          .status(404)
          .send("one or more of provided products couldnt be found...");
      }
    }

    const basket = new BasketModel(
      extractFieldsFromObject(req.body, ["products", "status", "payment"])
    );
    await basket.save();

    const savedBasket = await BasketModel.findById(basket._id).populate([
      { path: "products" },
      { path: "payment" },
    ]);
    return res
      .status(200)
      .send(
        extractFieldsFromObject(savedBasket, [
          "products",
          "status",
          "payment",
          "_id",
        ])
      );
  },
  detail: async function (req, res) {
    const basket = await BasketModel.findById(req.params.id).populate([
      { path: "products" },
      { path: "payment" },
    ]);
    if (!basket)
      return res.status(404).send("Basket with given ID was not found!");
    return res
      .status(200)
      .send(
        extractFieldsFromObject(basket, [
          "products",
          "status",
          "payment",
          "_id",
        ])
      );
  },
  getAll: async function (req, res) {
    const baskets = await BasketModel.find().populate([
      { path: "products" },
      { path: "payment" },
    ]);
    return res
      .status(200)
      .send(
        baskets.map((item) =>
          extractFieldsFromObject(item, [
            "products",
            "status",
            "payment",
            "_id",
          ])
        )
      );
  },
  update: async function (req, res) {
    const basket = await BasketModel.findById(req.params.id);
    if (!basket)
      return res.status(404).send("Basket with given ID was not found!");

    const basketObject = extractFieldsFromObject(req.body, [
      "products",
      "status",
      "payment",
    ]);

    const { error } = validateBasket(basketObject);
    if (error) return res.status(400).send(error.details[0].message);

    // check tag existance
    for (let product of req.body.products) {
      const productExists = await ProductModel.findById(product);
      if (!productExists) {
        return res
          .status(404)
          .send("one or more of provided tags couldnt be found...");
      }
    }

    await BasketModel.findByIdAndUpdate(req.params.id, basketObject);
    const updatedBasket = await BasketModel.findById(req.params.id).populate([
      { path: "products" },
      { path: "payment" },
    ]);
    res.status(200).send(updatedBasket);
  },
  delete: async function (req, res) {
    const basket = await BasketModel.findById(req.params.id).populate([
      { path: "products" },
      { path: "payment" },
    ]);
    if (!basket)
      return res.status(404).send("Basket with given ID was not found!");
    await BasketModel.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send(
        extractFieldsFromObject(basket, [
          "products",
          "status",
          "payment",
          "_id",
        ])
      );
  },
};

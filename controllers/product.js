const {
  model: ProductModel,
  validate: validateProduct,
  validateRate,
} = require("../models/product");
const { model: categoryModel } = require("../models/category");
const { model: PropertyModel } = require("../models/property");

const { extractFieldsFromObject } = require("../utilities/helpers");

module.exports = {
  create: async function (req, res) {
    const { error } = validateProduct(
      extractFieldsFromObject(req.body, [
        "name",
        "price",
        "categories",
        "images",
        "count",
        "colors",
        "rate",
        "properties",
      ])
    );
    if (error) return res.status(400).send(error.details[0].message);

    for (let category of req.body.categories) {
      const categoryIsFound = await categoryModel.findById(category);
      if (!categoryIsFound)
        return res
          .status(404)
          .send("one or more of provided categories could not be found in DB!");
    }

    if (req.body.properties) {
      for (let property of req.body.properties) {
        const propertyIsFound = await PropertyModel.findById(property.property);
        if (!propertyIsFound)
          return res
            .status(404)
            .send(
              "one or more of provided properties could not be found in DB!"
            );
      }
    }

    const product = new ProductModel(
      extractFieldsFromObject(req.body, [
        "name",
        "price",
        "categories",
        "images",
        "count",
        "colors",
        "rate",
        "properties",
      ])
    );
    await product.save();

    const savedProduct = await ProductModel.findById(product._id).populate([
      { path: "categories" },
      { path: "properties.property" },
      { path: "images" },
    ]);
    return res
      .status(200)
      .send(
        extractFieldsFromObject(savedProduct, [
          "name",
          "price",
          "categories",
          "images",
          "count",
          "colors",
          "rate",
          "properties",
          "_id",
        ])
      );
  },
  detail: async function (req, res) {
    const product = await ProductModel.findById(req.params.id).populate([
      { path: "categories" },
      { path: "properties.property" },
      { path: "images" },
    ]);
    if (!product)
      return res.status(404).send("Product with given ID was not found!");
    return res
      .status(200)
      .send(
        extractFieldsFromObject(product, [
          "_id",
          "name",
          "price",
          "categories",
          "images",
          "count",
          "colors",
          "rate",
          "properties",
        ])
      );
  },
  getAll: async function (req, res) {
    const products = await ProductModel.find().populate([
      { path: "categories" },
      { path: "properties.property" },
      { path: "images" },
    ]);
    return res
      .status(200)
      .send(
        products.map((item) =>
          extractFieldsFromObject(item, [
            "_id",
            "name",
            "price",
            "categories",
            "images",
            "count",
            "colors",
            "rate",
            "properties",
          ])
        )
      );
  },
  update: async function (req, res) {
    const product = await ProductModel.findById(req.params.id);
    if (!product)
      return res.status(404).send("Product with given ID was not found!");

    const ProjectObject = extractFieldsFromObject(req.body, [
      "name",
      "price",
      "categories",
      "images",
      "count",
      "colors",
      "rate",
      "properties",
    ]);

    const { error } = validateProduct(ProjectObject);
    if (error) return res.status(400).send(error.details[0].message);

    for (let category of req.body.categories) {
      const categoryIsFound = await categoryModel.findById(category);
      if (!categoryIsFound)
        return res
          .status(404)
          .send("one or more of provided categories could not be found in DB!");
    }

    if (req.body.properties) {
      for (let property of req.body.properties) {
        const propertyIsFound = await PropertyModel.findById(property.property);
        if (!propertyIsFound)
          return res
            .status(404)
            .send(
              "one or more of provided properties could not be found in DB!"
            );
      }
    }

    await ProductModel.findOneAndUpdate({ _id: req.params.id }, ProjectObject);
    const updatedProduct = await ProductModel.findById(req.params.id).populate([
      { path: "categories" },
      { path: "properties.property" },
      { path: "images" },
    ]);
    res
      .status(200)
      .send(
        extractFieldsFromObject(updatedProduct, [
          "_id",
          "name",
          "price",
          "categories",
          "images",
          "count",
          "colors",
          "rate",
          "properties",
        ])
      );
  },
  delete: async function (req, res) {
    const product = await ProductModel.findById(req.params.id).populate([
      { path: "categories" },
      { path: "properties.property" },
      { path: "images" },
    ]);
    if (!product)
      return res.status(404).send("Product with given ID was not found!");
    await ProductModel.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send(
        extractFieldsFromObject(product, [
          "name",
          "price",
          "categories",
          "images",
          "count",
          "colors",
          "rate",
          "properties",
          "_id",
        ])
      );
  },
  rate: async function (req, res) {
    const product = await ProductModel.findById(req.params.id).populate([
      { path: "categories" },
      { path: "properties.property" },
      { path: "images" },
    ]);
    if (!product)
      return res.status(404).send("Product with given ID was not found!");

    const rate = req.body.rate;
    const { error } = validateRate(extractFieldsFromObject(req.body, "rate"));
    if (error) return res.status(400).send(error.details[0].message);

    // find sum of rates, add one to count and calculate new rate
    const sum = product.rate.count * product.rate.average;
    let newCount = product.rate.count + 1;
    let newRate = (sum + rate) / newCount;

    // find if user has already rated!
    const duplicateRateUser = product.rate.users.find((user) => {
      return user.user == req.user._id;
    });
    if (duplicateRateUser) {
      // count should remain same
      newCount = product.rate.count;
      // remove the past rate and add new rate of user!
      newRate = (sum + rate - duplicateRateUser.rate) / newCount;

      // set new rate for user
      duplicateRateUser.rate = rate;
    }

    // set values to product rate field
    product.rate.count = newCount;
    product.rate.average = newRate;

    if (!duplicateRateUser) {
      product.rate.users.push({ user: req.user._id, rate: rate });
    }

    await product.save();

    const newProduct = await ProductModel.findById(req.params.id).populate([
      { path: "categories" },
      { path: "properties.property" },
      { path: "images" },
    ]);
    return res
      .status(200)
      .send(
        extractFieldsFromObject(newProduct, [
          "name",
          "price",
          "categories",
          "images",
          "count",
          "colors",
          "rate",
          "properties",
          "_id",
        ])
      );
  },
};

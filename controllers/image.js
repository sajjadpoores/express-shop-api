const {
  model: ImageModel,
  validate: validateImage,
} = require("../models/image");

const path = require("path");
const fs = require("fs");

const { extractFieldsFromObject } = require("../utilities/helpers");

module.exports = {
  create: async function (req, res) {
    const { error } = validateImage(extractFieldsFromObject(req.body, ["name", "category"]));
    if (error) return res.status(400).send(error.details[0].message);

    const tempPath = req.file.path;
    const imageName = `${new Date()
      .toISOString()
      .replace(/:/g, "-")}${path.extname(req.file.originalname)}`;
    const targetPath = path.join(__dirname, `../uploads/${imageName}`);

    if (
      path.extname(req.file.originalname).toLowerCase() === ".png" ||
      path.extname(req.file.originalname).toLowerCase() === ".jpg" ||
      path.extname(req.file.originalname).toLowerCase() === ".jpeg"
    ) {
      fs.rename(tempPath, targetPath, (err) => {
        if (err) return res.status(500).send({ status: "error", message: err });
      });
    } else {
      fs.unlink(tempPath, (err) => {
        if (err) return res.status(500).send({ status: "error", message: err });

        return res
          .status(500)
          .send({ status: "error", message: "file extention not supported!" });
      });
    }

    const image = new ImageModel({
      name: req.body.name,
      url: `/public/${imageName}`,
      category: req.body.category,
    });
    await image.save();

    const savedImage = ImageModel.findById(image._id).populate({
      path: "category",
    });
    return res.status(200).send(savedImage);
  },
  detail: async function (req, res) {
    const image = await ImageModel.findById(req.params.id).populate({
      path: "category",
    });
    if (!image)
      return res.status(404).send("Image with given ID was not found!");
    return res
      .status(200)
      .send(extractFieldsFromObject(image, ["name", "url", "category", "_id"]));
  },
  getAll: async function (req, res) {
    const images = await ImageModel.find().populate({ path: "category" });
    return res
      .status(200)
      .send(
        images.map((item) => extractFieldsFromObject(item, ["name", "category", "url", "_id"]))
      );
  },
  update: async function (req, res) {
    const image = await ImageModel.findById(req.params.id).populate({
      path: "category",
    });
    if (!image)
      return res.status(404).send("Image with given ID was not found!");

    const { error } = validateImage(extractFieldsFromObject(req.body, ["name", "category"]));
    if (error) return res.status(400).send(error.details[0].message);

    await ImageModel.findOneAndUpdate(
      { _id: req.params.id },
      extractFieldsFromObject(req.body, ["name", "category"])
    );
    return res.status(200).send({ url: image.url, name: req.body.name });
  },
  delete: async function (req, res) {
    const image = await ImageModel.findById(req.params.id).populate({
      path: "category",
    });
    if (!image)
      return res.status(404).send("Image with given ID was not found!");
    await ImageModel.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send(extractFieldsFromObject(image, ["name", "url", "category", "_id"]));
  },
};

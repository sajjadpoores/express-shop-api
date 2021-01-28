const {
  model: PaymentModel,
  validate: validatePayment,
} = require("../models/payment");
const { model: DiscountModel } = require("../models/discount");

const { extractFieldsFromObject } = require("../utilities/helpers");

module.exports = {
  create: async function (req, res) {
    const { error } = validatePayment(
      extractFieldsFromObject(req.body, [
        "date",
        "serialNumber",
        "status",
        "discount",
      ])
    );
    if (error) return res.status(400).send(error.details[0].message);

    // check discount existance if
    if (req.body.discount) {
      const discount = await DiscountModel.findById(req.body.discount);
      if (!discount)
        return res
          .status(404)
          .send("provided discount could not be found in DB!");
    }

    const payment = new PaymentModel(
      extractFieldsFromObject(req.body, [
        "date",
        "serialNumber",
        "status",
        "discount",
      ])
    );
    await payment.save();
    const savedPayment = await PaymentModel.findById(payment._id).populate({
      path: "discount",
    });
    return res
      .status(200)
      .send(
        extractFieldsFromObject(savedPayment, [
          "date",
          "serialNumber",
          "status",
          "discount",
          "_id",
        ])
      );
  },
  detail: async function (req, res) {
    const payment = await PaymentModel.findById(req.params.id).populate({
      path: "discount",
    });
    if (!payment)
      return res.status(404).send("Payment with given ID was not found!");
    return res
      .status(200)
      .send(
        extractFieldsFromObject(payment, [
          "_id",
          "date",
          "serialNumber",
          "status",
          "discount",
        ])
      );
  },
  getAll: async function (req, res) {
    const payments = await PaymentModel.find().populate({ path: "discount" });
    return res
      .status(200)
      .send(
        payments.map((item) =>
          extractFieldsFromObject(item, [
            "_id",
            "date",
            "serialNumber",
            "status",
            "discount",
          ])
        )
      );
  },
  update: async function (req, res) {
    const payment = await PaymentModel.findById(req.params.id);
    if (!payment)
      return res.status(404).send("Payment with given ID was not found!");

    const paymentObject = extractFieldsFromObject(req.body, [
      "date",
      "serialNumber",
      "status",
      "discount",
    ]);

    const { error } = validatePayment(paymentObject);
    if (error) return res.status(400).send(error.details[0].message);

    // check discount existance if
    if (req.body.discount) {
      const discount = await DiscountModel.findById(req.body.discount);
      if (!discount)
        return res
          .status(404)
          .send("provided discount could not be found in DB!");
    }

    await PaymentModel.findOneAndUpdate({ _id: req.params.id }, paymentObject);
    const updatedPayment = await PaymentModel.findById(req.params.id).populate({
      path: "discount",
    });
    res.status(200).send(updatedPayment);
  },
  delete: async function (req, res) {
    const payment = await PaymentModel.findById(req.params.id).populate({
      path: "discount",
    });
    if (!payment)
      return res.status(404).send("Payment with given ID was not found!");
    await PaymentModel.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send(
        extractFieldsFromObject(payment, [
          "date",
          "serialNumber",
          "status",
          "discount",
          "_id",
        ])
      );
  },
};

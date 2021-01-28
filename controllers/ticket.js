const {
  model: TicketModel,
  validate: validateTicket,
} = require("../models/ticket");
const { model: UserModel } = require("../models/user");
const { extractFieldsFromObject } = require("../utilities/helpers");

module.exports = {
  create: async function (req, res) {
    const { error } = validateTicket(
      extractFieldsFromObject(req.body, [
        "user",
        "date",
        "repliedToUser",
        "text",
      ])
    );
    if (error) return res.status(400).send(error.details[0].message);

    // check user existance
    if (req.body.user) {
      const userExists = await UserModel.findById(req.body.user);
      if (!userExists) {
        return res.status(404).send("Provided user couldnt be found...");
      }
    }

    // check replied to user existance
    if (req.body.repliedToUser) {
      const repliedToUserExists = await UserModel.findById(
        req.body.repliedToUser
      );
      if (!repliedToUserExists) {
        return res
          .status(404)
          .send("Provided repliedToUser couldnt be found...");
      }
    }

    const ticket = new TicketModel(
      extractFieldsFromObject(req.body, [
        "user",
        "date",
        "repliedToUser",
        "text",
      ])
    );
    await ticket.save();

    const savedTicket = await TicketModel.findById(ticket._id).populate([
      { path: "user", select: "-password", populate: { path: "permission" } },
      {
        path: "repliedToUser",
        select: "-password",
        populate: { path: "permission" },
      },
    ]);
    return res
      .status(200)
      .send(
        extractFieldsFromObject(savedTicket, [
          "user",
          "date",
          "repliedToUser",
          "text",
          "_id",
        ])
      );
  },
  detail: async function (req, res) {
    const ticket = await TicketModel.findById(req.params.id).populate([
      { path: "user", select: "-password", populate: { path: "permission" } },
      {
        path: "repliedToUser",
        select: "-password",
        populate: { path: "permission" },
      },
    ]);
    if (!ticket)
      return res.status(404).send("Basket with given ID was not found!");
    return res
      .status(200)
      .send(
        extractFieldsFromObject(ticket, [
          "user",
          "date",
          "repliedToUser",
          "text",
          "_id",
        ])
      );
  },
  getAll: async function (req, res) {
    const tickets = await TicketModel.find().populate([
      { path: "user", select: "-password", populate: { path: "permission" } },
      {
        path: "repliedToUser",
        select: "-password",
        populate: { path: "permission" },
      },
    ]);
    return res
      .status(200)
      .send(
        tickets.map((item) =>
          extractFieldsFromObject(item, [
            "user",
            "date",
            "repliedToUser",
            "text",
            "_id",
          ])
        )
      );
  },
  update: async function (req, res) {
    const ticket = await TicketModel.findById(req.params.id);
    if (!ticket)
      return res.status(404).send("Basket with given ID was not found!");

    const ticketObject = extractFieldsFromObject(req.body, [
      "user",
      "date",
      "repliedToUser",
      "text",
    ]);

    const { error } = validateTicket(ticketObject);
    if (error) return res.status(400).send(error.details[0].message);

    // check user existance
    if (req.body.user) {
      const userExists = await UserModel.findById(req.body.user);
      if (!userExists) {
        return res.status(404).send("Provided user couldnt be found...");
      }
    }

    // check replied to user existance
    if (req.body.repliedToUser) {
      const repliedToUserExists = await UserModel.findById(
        req.body.repliedToUser
      );
      if (!repliedToUserExists) {
        return res
          .status(404)
          .send("Provided repliedToUser couldnt be found...");
      }
    }

    await TicketModel.findByIdAndUpdate(req.params.id, ticketObject);
    const updatedTicket = await TicketModel.findById(req.params.id).populate([
      { path: "user", select: "-password", populate: { path: "permission" } },
      {
        path: "repliedToUser",
        select: "-password",
        populate: { path: "permission" },
      },
    ]);
    res.status(200).send(updatedTicket);
  },
  delete: async function (req, res) {
    const ticket = await TicketModel.findById(req.params.id).populate([
      { path: "user", select: "-password", populate: { path: "permission" } },
      {
        path: "repliedToUser",
        select: "-password",
        populate: { path: "permission" },
      },
    ]);
    if (!ticket)
      return res.status(404).send("Basket with given ID was not found!");
    await TicketModel.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send(
        extractFieldsFromObject(ticket, [
          "user",
          "date",
          "repliedToUser",
          "text",
          "_id",
        ])
      );
  },
};
router.post("/", async (req, res) => {});

router.get("/:id", async (req, res) => {});

router.get("/", async (req, res) => {});

router.put("/:id", [auth, authorization("addTicket")], async (req, res) => {});

router.delete(
  "/:id",
  [auth, authorization("addTicket")],
  async (req, res) => {}
);

module.exports = router;

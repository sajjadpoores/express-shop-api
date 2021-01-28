require("dotenv").config();
const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticket");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

router.post("/", [auth], ticketController.create);
router.get("/:id", [auth], ticketController.detail);
router.get("/", [auth, permission("addTicket")], ticketController.getAll);
router.put("/:id", [auth, permission("addTicket")], ticketController.update);
router.delete("/:id", [auth, permission("addTicket")], ticketController.delete);

module.exports = router;

require("dotenv").config();
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

router.post("/", [auth, permission("addPayment")], paymentController.create);
router.get("/:id", [auth, permission("addPayment")], paymentController.detail);
router.get("/", [auth, permission("addPayment")], paymentController.getAll);
router.put("/:id", [auth, permission("addPayment")], paymentController.update);
router.delete(
  "/:id",
  [auth, permission("addPayment")],
  paymentController.delete
);

module.exports = router;

require("dotenv").config();
const express = require("express");
const router = express.Router();
const discountController = require("../controllers/discount");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

router.post("/", [auth, permission("addDiscount")], discountController.create);
router.get(
  "/:id",
  [auth, permission("addDiscount")],
  discountController.detail
);
router.get("/", [auth, permission("addDiscount")], discountController.getAll);
router.put(
  "/:id",
  [auth, permission("addDiscount")],
  discountController.update
);
router.delete(
  "/:id",
  [auth, permission("addDiscount")],
  discountController.delete
);

router.post(
  "/:id/enable",
  [auth, permission("addDiscount")],
  discountController.enable
);

router.post(
  "/:id",
  [auth, permission("addDiscount")],
  discountController.disable
);

module.exports = router;

require("dotenv").config();
const express = require("express");
const router = express.Router();
const propertyListController = require("../controllers/propertyList");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

router.post(
  "/",
  [auth, permission("addProduct")],
  propertyListController.create
);
router.get(
  "/:id",
  [auth, permission("addProduct")],
  propertyListController.detail
);
router.get(
  "/",
  [auth, permission("addProduct")],
  propertyListController.getAll
);
router.put(
  "/:id",
  [auth, permission("addProduct")],
  propertyListController.update
);
router.delete(
  "/:id",
  [auth, permission("addProduct")],
  propertyListController.delete
);

module.exports = router;

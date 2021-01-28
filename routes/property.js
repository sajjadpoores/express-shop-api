require("dotenv").config();
const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/property");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

router.post("/", [auth, permission("addProduct")], propertyController.create);
router.get("/:id", [auth, permission("addProduct")], propertyController.detail);
router.get("/", [auth, permission("addProduct")], propertyController.getAll);
router.put("/:id", [auth, permission("addProduct")], propertyController.update);
router.delete(
  "/:id",
  [auth, permission("addProduct")],
  propertyController.delete
);

module.exports = router;

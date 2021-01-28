require("dotenv").config();
const express = require("express");
const router = express.Router();
const configController = require("../controllers/config");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

router.post("/", [auth, permission("addConfig")], configController.create);
router.get("/:id", configController.detail);
router.get("/", configController.getAll);
router.put(
  "/:id",
  [auth, permission("addConfig")],
  configController.update
);
router.delete(
  "/:id",
  [auth, permission("addConfig")],
  configController.delete
);

module.exports = router;

require("dotenv").config();
const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permission");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

router.post("/", [auth, permission("addPermission")], permissionController.create);
router.get("/:id", [auth, permission("addPermission")], permissionController.detail);
router.get("/", [auth, permission("addPermission")], permissionController.getAll);
router.put("/:id", [auth, permission("addPermission")], permissionController.update);
router.delete(
  "/:id",
  [auth, permission("addPermission")],
  permissionController.delete
);

module.exports = router;

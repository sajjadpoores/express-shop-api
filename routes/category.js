require("dotenv").config();
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

router.post("/", [auth, permission("addCategory")], categoryController.create);
router.get("/:id", categoryController.detail);
router.get("/", categoryController.getAll);
router.put(
  "/:id",
  [auth, permission("addCategory")],
  categoryController.update
);
router.delete(
  "/:id",
  [auth, permission("addCategory")],
  categoryController.delete
);

module.exports = router;

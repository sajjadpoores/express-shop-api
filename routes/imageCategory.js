require("dotenv").config();
const express = require("express");
const router = express.Router();
const imageCategoryController = require("../controllers/imageCategory");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

router.post(
  "/",
  [auth, permission("addImage")],
  imageCategoryController.create
);
router.get(
  "/:id",
  [auth, permission("addImage")],
  imageCategoryController.detail
);
router.get("/", [auth, permission("addImage")], imageCategoryController.getAll);
router.put(
  "/:id",
  [auth, permission("addImage")],
  imageCategoryController.update
);
router.delete(
  "/:id",
  [auth, permission("addImage")],
  imageCategoryController.delete
);

module.exports = router;

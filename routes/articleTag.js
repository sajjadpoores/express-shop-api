require("dotenv").config();
const express = require("express");
const router = express.Router();
const articleTagController = require("../controllers/articleTag");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

router.post("/", [auth, permission("writeArticle")], articleTagController.create);
router.get("/:id", articleTagController.detail);
router.get("/", articleTagController.getAll);
router.put(
  "/:id",
  [auth, permission("writeArticle")],
  articleTagController.update
);
router.delete(
  "/:id",
  [auth, permission("writeArticle")],
  articleTagController.delete
);

module.exports = router;

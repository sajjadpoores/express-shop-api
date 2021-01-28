require("dotenv").config();
const express = require("express");
const router = express.Router();
const articleController = require("../controllers/article");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

router.post("/", [auth, permission("writeArticle")], articleController.create);
router.get("/:id", articleController.detail);
router.get("/", articleController.getAll);
router.put(
  "/:id",
  [auth, permission("writeArticle")],
  articleController.update
);
router.delete(
  "/:id",
  [auth, permission("writeArticle")],
  articleController.delete
);
router.post("/:id/like", [auth], articleController.like);
router.post("/:id/unlike", [auth], articleController.unlike);

module.exports = router;

require("dotenv").config();
const express = require("express");
const router = express.Router();
const articleCommentController = require("../controllers/articleComment");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

router.post("/", [auth, permission("writeArticleComment")], articleCommentController.create);
router.get("/:id", articleCommentController.detail);
router.get("/", articleCommentController.getAll);
router.put(
  "/:id",
  [auth, permission("writeArticle")],
  articleCommentController.update
);
router.delete(
  "/:id",
  [auth, permission("writeArticle")],
  articleCommentController.delete
);
router.post(
  "/:id/approve",
  [auth, permission("writeArticle")],
  articleCommentController.approve
);
router.post(
  "/:id/disapprove",
  [auth, permission("writeArticle")],
  articleCommentController.disapprove
);

module.exports = router;

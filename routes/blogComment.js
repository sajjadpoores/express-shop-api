require("dotenv").config();
const express = require("express");
const router = express.Router();
const blogCommentController = require("../controllers/blogComment");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

router.post(
  "/",
  [auth, permission("writeBlogComment")],
  blogCommentController.create
);
router.get("/:id", blogCommentController.detail);
router.get("/", blogCommentController.getAll);
router.put(
  "/:id",
  [auth, permission("writeBlog")],
  blogCommentController.update
);
router.delete(
  "/:id",
  [auth, permission("writeBlog")],
  blogCommentController.delete
);
router.post(
  "/:id/approve",
  [auth, permission("writeBlog")],
  blogCommentController.approve
);
router.post(
  "/:id/disapprove",
  [auth, permission("writeBlog")],
  blogCommentController.disapprove
);

module.exports = router;

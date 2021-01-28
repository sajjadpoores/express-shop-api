require("dotenv").config();
const express = require("express");
const router = express.Router();
const blogTagController = require("../controllers/blogTag");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

router.post("/", [auth, permission("writeBlog")], blogTagController.create);
router.get("/:id", blogTagController.detail);
router.get("/", blogTagController.getAll);
router.put(
  "/:id",
  [auth, permission("writeBlog")],
  blogTagController.update
);
router.delete(
  "/:id",
  [auth, permission("writeBlog")],
  blogTagController.delete
);

module.exports = router;

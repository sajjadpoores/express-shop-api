require("dotenv").config();
const express = require("express");
const router = express.Router();
const blogController = require("../controllers/article");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

router.post("/", [auth, permission("writeBlog")], blogController.create);
router.get("/:id", blogController.detail);
router.get("/", blogController.getAll);
router.put("/:id", [auth, permission("writeBlog")], blogController.update);
router.delete("/:id", [auth, permission("writeBlog")], blogController.delete);
router.post("/:id/like", [auth], blogController.like);
router.post("/:id/unlike", [auth], blogController.unlike);

module.exports = router;

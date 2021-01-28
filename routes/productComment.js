require("dotenv").config();
const express = require("express");
const router = express.Router();
const productCommentController = require("../controllers/productComment");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

router.post("/", [auth], productCommentController.create);
router.get(
  "/:id",
  [auth, permission("addProduct")],
  productCommentController.detail
);
router.get("/", productCommentController.getAll);
router.put(
  "/:id",
  [auth, permission("addProduct")],
  productCommentController.update
);
router.delete(
  "/:id",
  [auth, permission("addProduct")],
  productCommentController.delete
);
router.post(
  "/:id/approve",
  [auth, permission("addProduct")],
  productCommentController.approve
);
router.post(
  "/:id/disapprove",
  [auth, permission("addProduct")],
  productCommentController.disapprove
);

module.exports = router;

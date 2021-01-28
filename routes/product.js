require("dotenv").config();
const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

router.post("/", [auth, permission("addProduct")], productController.create);
router.get("/:id", productController.detail);
router.get("/", productController.getAll);
router.put("/:id", [auth, permission("addProduct")], productController.update);
router.delete("/:id", [auth, permission("addProduct")], productController.delete);
router.rate('/:id/rate', [auth], productController.rate);
module.exports = router;

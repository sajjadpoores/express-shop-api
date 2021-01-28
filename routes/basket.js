require("dotenv").config();
const express = require("express");
const router = express.Router();
const basketController = require("../controllers/articleTag");
const auth = require("../middlewares/auth");

router.post("/", [auth], basketController.create);
router.get("/:id", [auth], basketController.detail);
router.get("/", [auth], basketController.getAll);
router.put("/:id", [auth], basketController.update);
router.delete("/:id", [auth], basketController.delete);

module.exports = router;

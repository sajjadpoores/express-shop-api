require("dotenv").config();
const express = require("express");
const router = express.Router();
const publicController = require("../controllers/public");

router.get("/:name", publicController.get);
router.get("/avatar/:name", publicController.getAvatar);
router.get("/optometry/:name", publicController.getOptometry);
router.get("/insurance/:name", publicController.getInsurance);

module.exports = router;

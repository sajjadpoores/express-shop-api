require("dotenv").config();
const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faq");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

router.post("/", [auth, permission("addFaq")], faqController.create);
router.get("/:id", faqController.detail);
router.get("/", faqController.getAll);
router.put("/:id", [auth, permission("addFaq")], faqController.update);
router.delete("/:id", [auth, permission("addFaq")], faqController.delete);

module.exports = router;

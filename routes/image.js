require("dotenv").config();
const express = require("express");
const router = express.Router();
const imageController = require("../controllers/image");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

const multer = require("multer");
const upload = multer({ dest: "temp/" });

router.post(
  "/",
  [auth, permission("addImage"), upload.single("image")],
  imageController.create
);
router.get("/:id", imageController.detail);
router.get("/", imageController.getAll);
router.put("/:id", [auth, permission("addImage")], imageController.update);
router.delete("/:id", [auth, permission("addImage")], imageController.delete);

module.exports = router;

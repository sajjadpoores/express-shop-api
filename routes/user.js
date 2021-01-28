require("dotenv").config();
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/:id", [auth, permission("addUser", true)], userController.detail);
router.get("/", [auth, permission("addUser")], userController.getAll);
router.get("/:id/ban", [auth, permission("addUser")], userController.ban);
router.get("/:id/unban", [auth, permission("addUser")], userController.unban);
router.post(
  "/upload-avatar",
  [auth, permission("addUser")],
  userController.uploadAvatar
);
router.post(
  "/upload-optometry",
  [auth, permission("addUser")],
  userController.uploadOptometry
);
router.post(
  "/upload-insurance",
  [auth, permission("addUser")],
  userController.uploadInsurance
);
module.exports = router;

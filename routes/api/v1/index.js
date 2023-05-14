const express = require("express");
var router = express.Router();
const userController = require("../../../src/controllers/user.controller");
const authController = require("../../../src/utils/authentication");
const PhotoMiddleware = require("../../../src/middlewares/photoUpload");
const chatController = require("../../../src/controllers/chat.controller");

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.post(
  "/updatebubblecolor",
  authController.authMiddleware,
  userController.setBubbleColor
);
router.post(
  "/addmessagedelay",
  authController.authMiddleware,
  userController.addMessageDelay
);

router.post(
  "/profilephotoupload",
  authController.authMiddleware,
  PhotoMiddleware.photoUpload.single("image"),
  PhotoMiddleware.profilePhotoSize,
  userController.profilePhotoUpload
);

router.post(
  "/newmessage",
  authController.authMiddleware,
  chatController.createChat
);

router.get("/getuser", authController.authMiddleware, userController.getUser);

router.get(
  "/getmessage",
  authController.authMiddleware,
  chatController.getChat
);

module.exports = router;

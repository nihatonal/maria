const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/reset", usersController.getUserReset);
router.get("/:uid", usersController.getUser);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

router.post(
  "/userphoto",
  fileUpload.single("image"),
  usersController.uploadImage
);
router.post("/userdocs", usersController.uploadDocs);

router.post("/login", usersController.login);
router.post("/forgetPassword", usersController.forgetPassword);

router.put("/updatepassword", usersController.updatePassword);
router.patch("/userphoto/:uid", usersController.updateUser);
router.patch("/userdocs/:uid", usersController.updateUserDocs);
router.patch("/friendlist/:uid", usersController.updateUserFriends);
router.patch("/requestfriend/:uid", usersController.updateFriendRequest);
router.patch("/requestfriend2/:uid", usersController.updateFriendRequest2);
router.patch("/motto/:uid", usersController.setMotto);
router.delete("/userphoto", usersController.deleteUser);

module.exports = router;

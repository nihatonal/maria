const express = require("express");
const { check } = require("express-validator");

const friendControllers = require("../controllers/friends-controllers");

const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.get("/:fid", friendControllers.getFriendById);

router.use(checkAuth);

router.get("/", friendControllers.getFriends);

router.get("/user/:uid", friendControllers.getFriendsByUserId);

router.post("/", friendControllers.createFriend);

router.patch(
  "/:fids",

  friendControllers.updateFriend
);

router.delete("/:fid", friendControllers.deleteFriend);

module.exports = router;

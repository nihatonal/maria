const fs = require("fs");
const { validationResult } = require("express-validator");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodeoutlook = require("nodejs-nodemailer-outlook");
const uuid = require("uuid/v1");
const crypto = require("crypto-js");
const Str = require("@supercharge/strings");
require("dotenv").config();
const nodemailer = require("nodemailer");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const getUser = async (req, res, next) => {
  let user;
  const userId = req.params.uid;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Fetching user failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({ user: user });
};

const getUserReset = async (req, res, next) => {
  let user;
  const token = req.query.resetPasswordToken;
  try {
    user = await User.find({
      $or: [
        {
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() },
        },
      ],
    });
    if (user.length <= 0) {
      res.json({ user: user, message: "password reset link is expired" });
    } else {
      res.json({ user: user, message: "password reset link ok" });
    }
  } catch (err) {
    const error = new HttpError(
      "Fetching user to reset failed, please try again later.",
      500
    );
    return next(error);
  }
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, birthdate, email, phone, password, nickname, image, docs } =
    req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create user", 500);

    return next(error);
  }

  const createdUser = new User({
    name, // name: name
    username: nickname,
    birthdate,
    email,
    phone,
    password: hashedPassword,
    image: " ",
    resetPasswordToken: "",
    resetPasswordExpires: "",
    friendList: [],
    motto: "",
    friendSendRequest: [],
    friendRecievedRequest: [],
    docs: [],
    cars: [],
    places: [],
  });
  console.log(createdUser);
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    console.log(err);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      `${process.env.JWT_KEY}`,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};
//////////
const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      res.json({ message: "email not in db", status: 403 });
    }

    if (existingUser) {
      let token;
      try {
        token = Str.random(50);
      } catch (err) {
        const error = new HttpError("Could not create user", 500);
        return next(error);
      }
      existingUser.resetPasswordToken = token;
      existingUser.resetPasswordExpires = Date.now() + 360000;
      try {
        await existingUser.save();
      } catch (err) {
        const error = new HttpError(
          "Something went wrong, could not update user.",
          500
        );
        return next(error);
      }
      nodeoutlook.sendEmail({
        auth: {
          user: "onalnihat@outlook.com",
          pass: "nihat2575",
        },
        from: "onalnihat@outlook.com",
        to: `${existingUser.email}`,
        subject: "Link to Reset Password",
        text:
          `You are receiving a link to reset your password.\n\n` +
          `Please click on the link to reset your password.\n\n` +
          `https://maria-ebaf9.web.app/reset/${token}\n\n`,
        onError: (e) => console.log("error", e),
        onSuccess: (i) => {
          res.send(i);
          console.log("success", i);
        },
      });
    }
  } catch (err) {
    const error = new HttpError("Error", 500);
    return next(error);
  }
};
//Update password
const updatePassword = async (req, res, next) => {
  const { userId, password } = req.body;

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not update user", 500);

    return next(error);
  }

  let user;

  try {
    user = await User.findById(userId).then((user) => {
      user.password = hashedPassword;
      try {
        user.save();
        console.log("updated");
        res.status(200).send({ message: "updated" });
      } catch (err) {
        const error = new HttpError(
          "Something went wrong, could not update password.",
          500
        );
        return next(error);
      }
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find user.",
      500
    );
    return next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      `${process.env.JWT_KEY}`,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

const uploadImage = async (req, res, next) => {
  try {
    const data = req.file;
    res.json({ message: "data recieved", data: data });
  } catch {
    res.status(500).send("error");
  }
};

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { image } = req.body;
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find user.",
      500
    );
    return next(error);
  }

  user.image = image;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
};

// request update
const updateFriendRequest = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { userId, requestId, requestFromFriend, requestToFriend } = req.body;
  let user;

  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }
  
  user.friendSendRequest = requestToFriend;
  
  
  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user requests.",
      500
    );
    return next(error);
  }
  let friend;

  try {
    friend = await User.findById(requestId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  friend.friendRecievedRequest = requestFromFriend;

  try {
    await friend.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user friends.",
      500
    );
    return next(error);
  }

  res.status(200).json({ user: user, friend: friend });
};

//Set Motto
const setMotto = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { userId, motto } = req.body;
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  user.motto = motto;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user friends.",
      500
    );
    return next(error);
  }

  res.status(200).json({ user: user });
};
//delete Request
const updateFriendRequest2 = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { userId, requestId, requestFromFriend, requestToFriend } = req.body;
  let user;

  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  user.friendRecievedRequest = requestFromFriend;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user friends.",
      500
    );
    return next(error);
  }
  let friend;

  try {
    friend = await User.findById(requestId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  friend.friendSendRequest = requestToFriend;

  try {
    await friend.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user friends.",
      500
    );
    return next(error);
  }

  res.status(200).json({ user: user, friend: friend });
};

//set friend
const updateUserFriends = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { userId, friendList, friendId, friendlist } = req.body;

  let user;
  console.log(req.body)
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  user.friendList = friendList;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user friends.",
      500
    );
    return next(error);
  }

  let friend;
  try {
    friend = await User.findById(friendId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }
  console.log(friendlist);
  friend.friendList = friendlist;

  try {
    await friend.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user friends.",
      500
    );
    return next(error);
  }

  res.status(200).json({ user: user, friend: friend });
};

const deleteUser = async (req, res, next) => {
  const { image } = req.body;

  fs.unlink(image, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted photouser." });
};

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images");
  },
  filename: (req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, uuid() + "." + ext);
  },
});

const multi_upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error("Only .jpg .jpeg .png images are supported!");
      err.name = "ExtensionError";
      return cb(err);
    }
  },
}).array("uploadImages", 6);

const uploadDocs = (req, res, next) => {
  multi_upload(req, res, function (err) {
    try {
      const data = req.files;
      console.log(req.files);

      res.json({ message: "data recieved", data: data });
    } catch {
      res.status(500).send("error");
    }
  });
};

const updateUserDocs = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { docs } = req.body;
  console.log(docs);
  const userId = req.params.uid;
  //const userId = "6223e25405d552e43ffbe617";

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find user.",
      500
    );
    return next(error);
  }

  user.docs = docs;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
};

exports.updateUserDocs = updateUserDocs;
exports.uploadDocs = uploadDocs;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
exports.uploadImage = uploadImage;
exports.getUsers = getUsers;
exports.getUser = getUser;
exports.signup = signup;
exports.login = login;
exports.forgetPassword = forgetPassword;
exports.getUserReset = getUserReset;
exports.updatePassword = updatePassword;
exports.updateUserFriends = updateUserFriends;
exports.updateFriendRequest = updateFriendRequest;
exports.updateFriendRequest2 = updateFriendRequest2;
exports.setMotto = setMotto;

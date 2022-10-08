const fs = require("fs");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Car = require("../models/car");
const Friend = require("../models/friend");
const User = require("../models/user");

// Getting all cars from

const getFriends = async (req, res, next) => {
  let friends;

  try {
    friends = await Friend.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    friends: friends.map((friend) => friend.toObject({ getters: true })),
  });
};

// Getting a photo of just a car

const getFriendById = async (req, res, next) => {
  const friendId = req.params.fid;

  let friend;
  try {
    friend = await Friend.findById(friendId);
  } catch (err) {
    const error = new HttpError(
      "Something wen wrong, could not find a car.",
      500
    );
    return next(error);
  }

  if (!friend) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ friend: friend.toObject({ getters: true }) }); // => { car } => { car: car }
};

// Getting all car photos of a users

const getFriendsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let cars;
  // try {
  //   cars = await Car.find({ creator: userId });
  // } catch (err) {
  //   const error = new HttpError(
  //     "Fetching cars failed, please try again later.",
  //     500
  //   );
  //   return next(error);
  // }

  let userWithFriends;
  try {
    userWithFriends = await User.findById(userId).populate("friends");
  } catch (err) {
    const error = new HttpError(
      "Fetching cars failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!userWithFriends || userWithFriends.friends.length === 0) {
    return next(
      new HttpError("Could not find cars for the provided user id.", 404)
    );
  }

  res.json({
    cars: userWithFriends.friends.map((friend) =>
      friend.toObject({ getters: true })
    ),
  });
};

// Create a car

const createFriend = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, surname, birthdate, image, owner } = req.body;

  const createdFriend = new Friend({
    name,
    surname,
    birthdate,
    image,
    owner,
  });

  let user;

  try {
    user = await User.findById(owner);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, user please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(`Could not find user for provided id.`, 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdFriend.save({ session: sess });
    user.friends.push(createdFriend);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    console.log(err);
    return next(error);
  }

  res.status(201).json({ friend: createdFriend });
};

// Update a Car Info

const updateFriend = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, surname, birthdate, image, owner } = req.body;

  const friendId = req.params.fid;

  let friend;
  try {
    friend = await Friend.findById(friendId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update car.",
      500
    );
    return next(error);
  }

  if (friend.owner.toString() !== req.userData.userId) {
    const error = new HttpError("You are now allowed to edit this car.", 401);
    return next(error);
  }

  (friend.name = name),
    (friend.surname = surname),
    (friend.birthdate = birthdate),
    (friend.image = image);

  try {
    await friend.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update car!!.",
      500
    );
    return next(error);
  }

  res.status(200).json({ friend: friend.toObject({ getters: true }) });
};

// Delete a Car

const deleteFriend = async (req, res, next) => {
  const friendId = req.params.fid;
  let friend;
  try {
    friend = await Friend.findById(friendId).populate("owner");
  } catch (err) {
    const error = new HttpError(
      "Something  went wrong, could not delete car.",
      500
    );
    return next(error);
  }

  if (!friend) {
    const error = new HttpError("Could not find car for this id.", 404);
    return next(error);
  }

  if (friend.owner.id !== req.userData.userId) {
    const error = new HttpError("You are now allowed to delete this car.", 401);

    return next(error);
  }

  const imagesPath = friend.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await friend.remove({ session: sess });
    friend.owner.friends.pull(friend);
    await friend.owner.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something  went wrong session, could not delete car.",
      500
    );
    return next(error);
  }

  fs.unlink(imagesPath, err => {
    console.log(err);
  });
  res.status(200).json({ message: "Deleted car." });
};

exports.getFriends = getFriends;
exports.getFriendById = getFriendById;
exports.getFriendsByUserId = getFriendsByUserId;
exports.createFriend = createFriend;
exports.updateFriend = updateFriend;
exports.deleteFriend = deleteFriend;

const fs = require("fs");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Car = require("../models/car");
const User = require("../models/user");

// Getting all cars from

const getCars = async (req, res, next) => {
  let cars;

  try {
    cars = await Car.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  
  res.json({ cars: cars.map((car) => car.toObject({ getters: true })) });
};

// Getting a photo of just a car

const getCarById = async (req, res, next) => {
  const carId = req.params.cid;

  let car;
  try {
    car = await Car.findById(carId);
  } catch (err) {
    const error = new HttpError(
      "Something wen wrong, could not find a car.",
      500
    );
    return next(error);
  }

  if (!car) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ car: car.toObject({ getters: true }) }); // => { car } => { car: car }
};

// Getting all car photos of a users

const getCarsByUserId = async (req, res, next) => {
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

  let userWithCars;
  try {
    userWithCars = await User.findById(userId).populate("cars");
  } catch (err) {
    const error = new HttpError(
      "Fetching cars failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!userWithCars || userWithCars.cars.length === 0) {
    return next(
      new HttpError("Could not find cars for the provided user id.", 404)
    );
  }

  res.json({
    cars: userWithCars.cars.map((car) => car.toObject({ getters: true })),
  });
};

// Create a car

const createCar = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    brand,
    model,
    year,
    plate_number,
    vin_number,
    color,
    car_body,
    engine_type,
    engine_volume,
    engine_power,
    engine_transmission,
    engine_run,
    pts,
    sts,
    price,
    price_for3,
    price_more5,
    policy,
    insurance,
    options,
    services,
    images,
    carDocs,
    owner,
  } = req.body;

  const createdCar = new Car({
    brand,
    model,
    year,
    plate_number,
    vin_number,
    car_body,
    color,
    engine_type,
    engine_volume,
    engine_power,
    engine_transmission,
    engine_run,
    pts,
    sts,
    price,
    price_for3,
    price_more5,
    policy,
    insurance,
    options,
    services,
    images,
    carDocs,
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
    await createdCar.save({ session: sess });
    user.cars.push(createdCar);
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

  res.status(201).json({ car: createdCar });
};

// Update a Car Info

const updateCar = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    plate_number,
    engine_run,
    sts,
    price,
    price_for3,
    price_more5,
    policy,
    insurance,
    options,
    services,
    images,
    carDocs
  } = req.body;

  const carId = req.params.cid;

  let car;
  try {
    car = await Car.findById(carId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update car.",
      500
    );
    return next(error);
  }

  if (car.owner.toString() !== req.userData.userId) {
    const error = new HttpError("You are now allowed to edit this car.", 401);
    return next(error);
  }

  car.plate_number = plate_number,
    car.engine_run = engine_run,
    car.sts = sts,
    car.price = price,
    car.price_for3 = price_for3,
    car.price_more5 = price_more5,
    car.policy = policy,
    car.insurance = insurance,
    car.options = options,
    car.services = services,
    car.images = images,
    car.carDocs= carDocs

  try {
    await car.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update car!!.",
      500
    );
    return next(error);
  }

  res.status(200).json({ car: car.toObject({ getters: true }) });
};

// Delete a Car

const deleteCar = async (req, res, next) => {
  const carId = req.params.cid;

  let car;
  try {
    car = await Car.findById(carId).populate("owner");
  } catch (err) {
    const error = new HttpError(
      "Something  went wrong, could not delete car.",
      500
    );
    return next(error);
  }

  if (!car) {
    const error = new HttpError("Could not find car for this id.", 404);
    return next(error);
  }

  if (car.owner.id !== req.userData.userId) {
    const error = new HttpError("You are now allowed to delete this car.", 401);

    return next(error);
  }

  const imagesPath = car.images;
  const docsPath = car.carDocs;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await car.remove({ session: sess });
    car.owner.cars.pull(car);
    await car.owner.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something  went wrong session, could not delete car.",
      500
    );
    return next(error);
  }

  imagesPath.map((item) => {
    fs.unlink(item, (err) => {
      console.log(err);
    });
  });
  docsPath.map((item) => {
    fs.unlink(item, (err) => {
      console.log(err);
    });
  });

  res.status(200).json({ message: "Deleted car." });
};

exports.getCars = getCars;
exports.getCarById = getCarById;
exports.getCarsByUserId = getCarsByUserId;
exports.createCar = createCar;
exports.updateCar = updateCar;
exports.deleteCar = deleteCar;

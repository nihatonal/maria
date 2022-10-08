const fs = require('fs');
const { validationResult } = require('express-validator');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const uuid = require('uuid/v1');

const HttpError = require('../models/http-error');
const User = require('../models/user');


const getUsers = async (req, res, next) => {
  let users;
  
  try {
    users = await User.find({},'-password');  
  } catch(err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
      return next(error);
  }
  res.json({users: users.map(user => user.toObject({ getters:true })) });
};

const getUser = async (req, res, next) => {
  let user;
  const userId = req.params.uid;
  try {
    user = await User.findById(userId);  
  } catch(err) {
    const error = new HttpError(
      'Fetching user failed, please try again later.',
      500
    );
      return next(error);
  }
  
  res.json({user: user });
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { 
        name,
        birthdate, 
        email,
        phone, 
        password,
        image,
        docs
    } = req.body;

    let existingUser;
    try {
      existingUser = await User.findOne({email: email});
    } catch(err) {
      const error = new HttpError(
        'Signing up failed, please try again later.',
        500
      )
      return next(error);
    } 

    if(existingUser) {
      const error = new HttpError(
        'User exists already, please login instead.',
        422
      )
      return next(error);
    }

    let hashedPassword;

    try {

      hashedPassword = await bcrypt.hash(password, 12);

    } catch (err){

      const error = new HttpError ("Could not create user", 500);

    return next(error);

    }

    const createdUser = new User( {
        name, // name: name
        birthdate,
        email,
        phone,
        password: hashedPassword,
        image:" ",
        docs: [],
        cars: []
    });
    console.log(createdUser)
    try{
      await createdUser.save();
    } catch (err) {
      const error = new HttpError(
        'Signing up failed, please try again.',
        500
      );
      console.log(err)
      return next(error);
    }


    let token;
    try {
      token = jwt.sign(
        {userId:createdUser.id, email:createdUser.email},
        `${process.env.JWT_KEY}`, 
        {expiresIn: '1h'}
      );
    } catch(err) {
      const error = new HttpError(
        'Signing up failed, please try again.',
        500
      );
      return next(error);
    }
    

    res.status(201).json({userId: createdUser.id, email:createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      `${process.env.JWT_KEY}`,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token
  });
};

const uploadImage = async (req, res, next) => {
    try {
      const data = req.file;
      res.json({message: "data recieved", data: data });
    }catch {
      res.status(500).send("error");
    }
};

const updateUser = async (req,res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { image } = req.body;
  const userId = req.params.uid;


  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find user.',
      500
    );
    return next(error);
  }

  user.image = image;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update user.',
      500
    );
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
};

const deleteUser = async (req, res, next) => {
  const { image } = req.body;

  fs.unlink(image, err => {
    console.log(err);
  });

  res.status(200).json({ message: 'Deleted photouser.' });
}

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid() + '.' + ext);
    }
});

const multi_upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/jpg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error('Only .jpg .jpeg .png images are supported!');
      err.name = 'ExtensionError';
      return cb(err);
    }
  },
}).array('uploadImages', 6);

const uploadDocs = (req, res, next) => {
  multi_upload(req, res, function (err) {
 
  try {
    const data = req.files;
    console.log(req.files)

    res.json({message: "data recieved", data: data });
   }catch {
    res.status(500).send("error");
   }
  })
};


const updateUserDocs = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { docs } = req.body;
  console.log(docs)
  const userId = req.params.uid;
  //const userId = "6223e25405d552e43ffbe617";

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find user.',
      500
    );
    return next(error);
  }

  user.docs = docs;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update user.',
      500
    );
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) })
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

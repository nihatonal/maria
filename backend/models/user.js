const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  birthdate: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true, minlenght: 8 },
  resetPasswordToken: { type: String, required: false },
  resetPasswordExpires: { type: String, required: false },
  image: { type: String, required: true },
  docs: [{ type: String, required: true }],
  friendList: [],
  friendSendRequest:[],
  friendRecievedRequest:[],
  cars: [{ type: mongoose.Types.ObjectId, required: true, ref: "Car" }],
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }], // cars and users relation
  friends: [{ type: mongoose.Types.ObjectId, required: true, ref: "Friend" }], // cars and users relation
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

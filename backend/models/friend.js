const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const friendSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  birthdate: { type: String, required: true},
  image: { type: String, required: true },
  owner: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});


module.exports = mongoose.model('Friend', friendSchema);



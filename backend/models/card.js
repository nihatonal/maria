const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cardSchema = new Schema({
  ru: { type: String, required: true },
  en: { type: String, required: true },
  options:[],
  services:[],
  images:[],
  carDocs:[],
  owner: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});


module.exports = mongoose.model('Car', cardSchema);
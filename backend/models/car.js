const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carSchema = new Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: String, required: true },
  plate_number: { type: String, required: true },
  vin_number: { type: String, required: true },
  color: { type: String, required: true },
  car_body: { type: String, required: true },
  engine_type: { type: String, required: true },
  engine_volume: { type: String, required: true },
  engine_power: { type: String, required: true },
  engine_transmission: { type: String, required: true },
  engine_run: { type: String, required: true },
  pts: { type: String, required: true },
  sts: { type: String, required: true },
  price: { type: String, required: true },
  price_for3: { type: String, required: true },
  price_more5: { type: String, required: true },
  policy: { type: String, required: true },
  insurance: { type: String, required: true },
  options:[],
  services:[],
  images:[],
  carDocs:[],
  owner: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});


module.exports = mongoose.model('Car', carSchema);
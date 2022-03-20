const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const giftSchema = Schema({
  date:{
    type: String,
    required: true,
  },
  toClientId: {
    type: String,
    required: true,
  },
  fromClientId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
   price: {
    type: Number,
    required: true,
  },
  instrument:{
    type: String,
    required: true,
    uppercase: true
  }
});

module.exports = mongoose.model("Gift", giftSchema);
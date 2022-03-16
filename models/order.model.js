const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema({
  date:{
    type: String,
    required: true,
  },
  type:{
    type: String,
    required: true,
  },
  clientId: {
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
  },
  status:{
    type: String,
    required: true,
  },
  message:{
    type: String
  },
});

module.exports = mongoose.model("Order", orderSchema);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const holdingSchema = Schema({
  clientId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  instrument:{
    type: String,
    required: true,
    uppercase: true
  },
  price: {
    type: Number,
    required: true,
  },
  dateCreated:{
      type: String,
      default: new Date().toLocaleDateString("en-US"),
  }
  


});

module.exports = mongoose.model("Holding", holdingSchema);
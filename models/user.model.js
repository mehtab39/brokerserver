const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const userSchema = Schema({
  clientId: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  pancard: {
    type: String,
    required: true,
    maxLength: 10,
    minLength: 10,

  },
  funds: {
    type: Number,
    default: 0,
  },
  watchlist: [{
    type: String,
    index: {unique: true}

  }],
  yearBorn: {
    type: Number,
    min: -1930,
    max: (new Date).getFullYear() - 18,
    required: true
  },

  expensesheet: [{

  }],
  bankdetails: {
   
  }

});
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10, (err, hash) => {
    this.password = hash;
    return next();
  });
});

userSchema.methods.checkPassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, function (err, same) {
      if (err) return reject(err);

      return resolve(same);
    });
  });
};
module.exports = mongoose.model("User", userSchema);
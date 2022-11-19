const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },  
  },
  { timestamps: true }
);

module.exports = mongoose.model("User2", UserSchema);
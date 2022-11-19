const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema(
  {
    task: {
      type: String,
    },  
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ToDo", TodoSchema);
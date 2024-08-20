const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todoSchema = Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    index: { type: Number, required: true },
    isComplete: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;

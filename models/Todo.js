const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todoSchema = Schema(
  {
    title: { type: String, required: true },
    content: { type: String },
    category: { type: String },
    index: { type: Number },
    isComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;

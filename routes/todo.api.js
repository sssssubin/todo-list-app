const express = require("express");
const router = express.Router();
const {
  getTodos,
  getTodoById,
  createTodo,
  editTodo,
  deleteTodo,
} = require("../controllers/todo.controller");

router.get("/", getTodos);
router.get("/:id", getTodoById);
router.post("/new", createTodo);
router.put("/edit/:id", editTodo);
router.delete("/delete/:id", deleteTodo);

module.exports = router;

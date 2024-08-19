const Todo = require("../models/Todo");

// 공통 에러 핸들링 함수
const handleError = (res, error, statusCode = 400) => {
  console.error(error); // 서버 측 로그에 오류 출력
  res.status(statusCode).json({ status: "fail", error: error.message });
};

// 모든 할일 가져오기(GET)
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    if (todos.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "No todos found" });
    }
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.json(todos);
    } else {
      return res.render("index", { todos });
    }
  } catch (error) {
    handleError(res, error);
  }
};

// 특정 할일 가져오기(GET)
const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res
        .status(404)
        .json({ status: "fail", message: "Todo not found" });
    }
    return res.json(todo);
  } catch (error) {
    handleError(res, error);
  }
};

// 할일 추가하기(POST)
const createTodo = async (req, res) => {
  try {
    const { title, category, content } = req.body;
    const newTodo = new Todo({ title, category, content });
    await newTodo.save();
    return res.status(201).json(newTodo);
  } catch (error) {
    handleError(res, error);
  }
};

// 할일 수정하기(PUT)
const editTodo = async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTodo) {
      return res
        .status(404)
        .json({ status: "fail", message: "Todo not found" });
    }
    return res.json(updatedTodo);
  } catch (error) {
    handleError(res, error);
  }
};

// 할일 삭제하기(DELETE)
const deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res
        .status(404)
        .json({ status: "fail", message: "Todo not found" });
    }
    return res.status(200).json({ status: "success", message: "Todo deleted" });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  editTodo,
  deleteTodo,
};

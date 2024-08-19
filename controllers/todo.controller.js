const Todo = require("../models/Todo");

// 공통 에러 핸들링 함수
const handleError = (res, error, statusCode = 400) => {
  console.error(error); // 서버 측 로그에 오류 출력
  res.status(statusCode).json({ status: "fail", error: error.message });
};

// 모든 할일 가져오기(GET)
const getTodos = async (req, res) => {
  try {
  } catch (error) {
    handleError(res, error);
  }
};

// 특정 할일 가져오기(GET)
const getTodoById = async (req, res) => {
  try {
  } catch (error) {
    handleError(res, error);
  }
};

// 할일 추가하기(POST)
const createTodo = async (req, res) => {
  try {
  } catch (error) {
    handleError(res, error);
  }
};

// 할일 수정하기(PUT)
const editTodo = async (req, res) => {
  try {
  } catch (error) {
    handleError(res, error);
  }
};

// 할일 삭제하기(DELETE)
const deleteTodo = async (req, res) => {
  try {
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

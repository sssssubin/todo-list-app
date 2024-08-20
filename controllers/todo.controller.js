const Todo = require("../models/Todo");

// 공통 에러 핸들링 함수
const handleError = (res, error, statusCode = 400) => {
  console.error(error); // 서버 측 로그에 오류 출력
  res.status(statusCode).json({ status: "fail", error: error.message });
};

// 모든 할일 가져오기(GET)
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ index: -1 }); // 내림차순으로 정렬
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

    // 현재 게시물의 개수를 확인하고 index 할당
    const count = await Todo.countDocuments();
    const newIndex = count + 1;

    const newTodo = new Todo({ title, category, content, index: newIndex });
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

    // 삭제 후 인덱스 재정렬
    await Todo.updateMany(
      { index: { $gt: deletedTodo.index } }, // 삭제된 할일의 인덱스보다 큰 인덱스를 가진 문서들
      { $inc: { index: -1 } } // 인덱스를 1 감소
    );

    return res.status(200).json({ status: "success", message: "Todo deleted" });
  } catch (error) {
    handleError(res, error);
  }
};

// 할 일 순서 업데이트하기 (PUT)
const updateTodoOrder = async (req, res) => {
  const reorderedTodos = req.body;

  // 요청 본문이 배열인지 확인
  if (!Array.isArray(reorderedTodos)) {
    return res.status(400).json({
      status: "fail",
      error: "Expected an array of reordered todos",
    });
  }

  try {
    // 각각의 할 일을 찾아 순서(index)를 업데이트
    for (const todo of reorderedTodos) {
      await Todo.findByIdAndUpdate(todo._id, { index: todo.index });
    }

    // 모든 Todo 항목의 인덱스를 내림차순으로 재정렬
    const todos = await Todo.find().sort({ index: -1 });
    todos.forEach((todo, i) => {
      todo.index = i + 1; // 새로운 인덱스 설정
      todo.save(); // 인덱스 저장
    });

    return res.json({
      status: "success",
      message: "Order updated successfully",
    });
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
  updateTodoOrder,
};

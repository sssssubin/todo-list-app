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
      // return res.render("index", { todos });
      return res.render("index", { todos }); // EJS 템플릿에 todos 변수를 전달합니다.
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

// 할일 완료 상태 업데이트
const patchTodo = async (req, res) => {
  const { id } = req.params;
  const { isComplete } = req.body;
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { isComplete },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: "Bad Request" });
  }
};

// 할 일 순서 업데이트하기 (PUT)
const updateTodoOrder = async (req, res) => {
  try {
    const updatedTodos = req.body; // 클라이언트에서 전송된 todo 리스트 (이미 내림차순)

    // 모든 Todo 문서를 업데이트
    const updatePromises = updatedTodos.map((todo) => {
      return Todo.findByIdAndUpdate(todo._id, { index: todo.index });
    });

    await Promise.all(updatePromises); // 모든 업데이트 완료될 때까지 대기
    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating todo order:", error);
    res.status(500).json({ message: "Failed to update order" });
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  editTodo,
  deleteTodo,
  patchTodo,
  updateTodoOrder,
};

document.addEventListener("DOMContentLoaded", () => {
  let dragSrcEl = null;
  let todos = []; // 전역 변수로 선언

  // 팝업 열기 함수
  function openPopup(mode, todoData = null) {
    const popupElement = document.getElementById("popup");
    const popupTitleElement = document.getElementById("popup-title");
    const titleInputElement = document.getElementById("popup-title-input");
    const categoryInputElement = document.getElementById("todo-category");
    const contentTextareaElement = document.getElementById("popup-content");
    const idInputElement = document.getElementById("todo-id");
    const saveButton = document.getElementById("popup-save");
    const cancelButton = document.getElementById("popup-close");
    const modifyButton = document.getElementById("popup-modify");

    // 초기화: 모든 버튼 숨기기 및 필드 활성화
    saveButton.style.display = "none";
    cancelButton.style.display = "none";
    modifyButton.style.display = "none";
    titleInputElement.disabled = false;
    categoryInputElement.disabled = false;
    contentTextareaElement.disabled = false;

    // 제목과 설명 설정
    if (mode === "edit") {
      popupTitleElement.textContent = "Edit TODO";
      if (todoData) {
        titleInputElement.value = todoData.title || "";
        categoryInputElement.value = todoData.category || "";
        contentTextareaElement.value = todoData.content || "";
        idInputElement.value = todoData._id || "";
      }
      // 버튼과 필드 설정
      saveButton.textContent = "Save";
      saveButton.style.display = "block";
      cancelButton.style.display = "block";
      modifyButton.style.display = "none";
      saveButton.onclick = async () => {
        const title = titleInputElement.value;
        const category = categoryInputElement.value;
        const content = contentTextareaElement.value;
        const id = idInputElement.value;

        try {
          const response = await fetch(`/todos/edit/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, category, content }),
          });

          if (response.ok) {
            location.reload(); // 페이지 새로고침
          } else {
            console.error("Failed to update todo");
          }
        } catch (error) {
          console.error("Error updating todo:", error);
        }

        closePopup();
      };
    } else if (mode === "delete") {
      popupTitleElement.textContent = "DELETE TODO?";
      if (todoData) {
        titleInputElement.value = todoData.title || "";
        categoryInputElement.value = todoData.category || "";
        contentTextareaElement.value = todoData.content || "";
        idInputElement.value = todoData._id || ""; // Ensure _id is available in todoData
      }
      // 버튼과 필드 설정
      titleInputElement.disabled = true;
      categoryInputElement.disabled = true;
      contentTextareaElement.disabled = true;
      saveButton.style.display = "block";
      saveButton.textContent = "Delete";
      modifyButton.style.display = "block"; // 수정 버튼 표시
      cancelButton.style.display = "block"; // 취소 버튼 표시
      saveButton.onclick = async () => {
        const id = idInputElement.value;

        const response = await fetch(`/todos/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          location.reload(); // 페이지 새로고침
        } else {
          console.error("Failed to delete todo");
        }

        closePopup();
      };
      modifyButton.onclick = () => {
        closePopup(); // 현재 팝업 닫기
        openPopup("edit", todoData); // 수정 팝업 열기
      };
    } else if (mode === "view") {
      popupTitleElement.textContent = "View TODO";
      if (todoData) {
        titleInputElement.value = todoData.title || "";
        categoryInputElement.value = todoData.category || "";
        contentTextareaElement.value = todoData.content || "";
        idInputElement.value = todoData._id || ""; // Ensure _id is available in todoData
      }
      // 버튼과 필드 설정
      titleInputElement.disabled = true;
      categoryInputElement.disabled = true;
      contentTextareaElement.disabled = true;
      saveButton.style.display = "none";
      modifyButton.style.display = "block"; // 수정 버튼 표시
      cancelButton.style.display = "block"; // 취소 버튼 표시
      modifyButton.onclick = () => {
        closePopup(); // 현재 팝업 닫기
        openPopup("edit", todoData); // 수정 팝업 열기
      };
    } else {
      popupTitleElement.textContent = "New TODO";
      titleInputElement.value = "";
      categoryInputElement.value = "";
      contentTextareaElement.value = "";
      idInputElement.value = "";
      // 버튼과 필드 설정
      titleInputElement.disabled = false;
      categoryInputElement.disabled = false;
      contentTextareaElement.disabled = false;
      saveButton.style.display = "block";
      modifyButton.style.display = "none";
      cancelButton.style.display = "block";
      saveButton.onclick = async () => {
        const title = titleInputElement.value;
        const category = categoryInputElement.value;
        const content = contentTextareaElement.value;

        try {
          const response = await fetch("/todos/new", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, category, content }),
          });

          if (response.ok) {
            location.reload(); // 페이지 새로고침
          } else {
            console.error("Failed to create todo");
          }
        } catch (error) {
          console.error("Error creating todo:", error);
        }

        closePopup();
      };
    }

    // 팝업 표시
    document.getElementById("popup-overlay").classList.remove("hidden");
    popupElement.classList.remove("hidden");
  }

  // 팝업 닫기 함수
  function closePopup() {
    document.getElementById("popup-overlay").classList.add("hidden");
    document.getElementById("popup").classList.add("hidden");
  }

  // TODO 리스트 렌더링 함수
  function renderTodoList(todos) {
    const todoListContainer = document.getElementById("todo-list");

    if (!todoListContainer) {
      console.error("Todo list container element not found.");
      return;
    }

    // TODO 리스트 초기화
    todoListContainer.innerHTML = "";

    todos.forEach((todo, idx) => {
      todo.index = idx;
      const todoItem = document.createElement("li");
      todoItem.classList.add("todo-item");
      if (todo.isComplete) {
        todoItem.classList.add("completed");
      }
      todoItem.dataset.id = todo._id; // data-id 속성 설정

      todoItem.innerHTML = `
      <button class="move-button">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
          <rect width="8" height="8" rx="4" fill="#D0D5DD" />
          <rect y="12" width="8" height="8" rx="4" fill="#D0D5DD" />
          <rect x="12" width="8" height="8" rx="4" fill="#D0D5DD" />
          <rect x="12" y="12" width="8" height="8" rx="4" fill="#D0D5DD" />
        </svg>
      </button>
      <label class="custom-checkbox">
          <input
            type="checkbox"
            id="${todo._id}"
            ${todo.isComplete ? "checked" : ""}
          />
        <span></span>
      </label>
      <label class="todo-title" for="${todo._id}">${todo.title}</label>
      <div class="actions">
        <button class="edit-button ico-button" data-id="${todo._id}">
          <i class="fas fa-edit">
              <svg
                width="18"
                height="18"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.67272 3.99106L1 10.6637V14H4.33636L11.0091 7.32736M7.67272 3.99106L10.0654 1.59837L10.0669 1.59695C10.3962 1.26759 10.5612 1.10261 10.7514 1.04082C10.9189 0.986392 11.0993 0.986392 11.2669 1.04082C11.4569 1.10257 11.6217 1.26735 11.9506 1.59625L13.4018 3.04738C13.7321 3.37769 13.8973 3.54292 13.9592 3.73337C14.0136 3.90088 14.0136 4.08133 13.9592 4.24885C13.8974 4.43916 13.7324 4.60414 13.4025 4.93398L13.4018 4.93468L11.0091 7.32736M7.67272 3.99106L11.0091 7.32736"
                  stroke="#CDCDCD"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
          </i>
        </button>
        <button class="trash-button ico-button" data-id="${todo._id}">
          <i class="fas fa-trash-alt">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.87414 7.61505C3.80712 6.74386 4.49595 6 5.36971 6H12.63C13.5039 6 14.1927 6.74385 14.1257 7.61505L13.6064 14.365C13.5463 15.1465 12.8946 15.75 12.1108 15.75H5.88894C5.10514 15.75 4.45348 15.1465 4.39336 14.365L3.87414 7.61505Z"
                  stroke="#CDCDCD"
                />
                <path
                  d="M14.625 3.75H3.375"
                  stroke="#CDCDCD"
                  stroke-linecap="round"
                />
                <path
                  d="M7.5 2.25C7.5 1.83579 7.83577 1.5 8.25 1.5H9.75C10.1642 1.5 10.5 1.83579 10.5 2.25V3.75H7.5V2.25Z"
                  stroke="#CDCDCD"
                />
                <path d="M10.5 9V12.75" stroke="#CDCDCD" stroke-linecap="round" />
                <path d="M7.5 9V12.75" stroke="#CDCDCD" stroke-linecap="round" />
              </svg>
          </i>
        </button>
      </div>
    `;

      // TODO 항목 클릭 이벤트 추가(뷰페이지)
      todoItem.querySelector(".todo-title").addEventListener("click", () => {
        openPopup("view", todo);
      });

      todoListContainer.appendChild(todoItem);
    });
  }

  // TODO 리스트의 동작 버튼에 이벤트 리스너를 추가하는 함수
  function addTodoEventListeners() {
    const todoListContainer = document.getElementById("todo-list");

    if (todoListContainer) {
      // 수정 버튼 클릭 이벤트
      todoListContainer.addEventListener("click", function (event) {
        if (event.target.closest(".edit-button")) {
          const id = event.target.closest(".edit-button").dataset.id;

          fetch(`/todos/${id}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then((todo) => {
              openPopup("edit", todo);
            })
            .catch((error) => console.error("Error fetching todo:", error));
        }

        // 상세 보기 버튼 클릭 이벤트
        if (event.target.closest(".view-button")) {
          const id = event.target.closest(".view-button").dataset.id;

          fetch(`/todos/${id}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then((todo) => {
              openPopup("view", todo);
            })
            .catch((error) => console.error("Error fetching todo:", error));
        }
      });

      // 삭제 버튼 클릭 이벤트
      todoListContainer.addEventListener("click", function (event) {
        if (event.target.closest(".trash-button")) {
          const id = event.target.closest(".trash-button").dataset.id;

          fetch(`/todos/${id}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then((todo) => {
              openPopup("delete", todo);
            })
            .catch((error) => console.error("Error fetching todo:", error));
        }
      });

      // 체크박스 클릭 이벤트
      todoListContainer.addEventListener("change", async function (event) {
        if (event.target.type === "checkbox") {
          const todoId = event.target.id;
          const isComplete = event.target.checked;

          try {
            const response = await fetch(`/todos/${todoId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ isComplete }),
            });

            if (response.ok) {
              // 클라이언트에서 UI 업데이트
              const updatedTodo = await response.json();
              const todoItem = document.querySelector(
                `.todo-item[data-id='${todoId}']`
              );
              if (isComplete) {
                todoItem.classList.add("completed");
              } else {
                todoItem.classList.remove("completed");
              }
            } else {
              console.error("Failed to update todo completion status");
            }
          } catch (error) {
            console.error("Error updating todo completion status:", error);
          }
        }
      });

      // 드래그 가능 설정
      const dragTodoItems = document.querySelectorAll(".move-button");
      dragTodoItems.forEach((dragTodoItem) => {
        dragTodoItem.setAttribute("draggable", "true");
      });

      // 드래그 시작 이벤트
      todoListContainer.addEventListener("dragstart", function (event) {
        if (event.target.closest(".move-button")) {
          dragSrcEl = event.target.closest(".todo-item"); // 드래그 시작된 요소 저장
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/html", dragSrcEl.innerHTML);
          dragSrcEl.classList.add("dragging");
          console.log("drag 시작", event.target); // 여기서 target을 event.target으로 변경
        }
      });

      // 드래그 끝 이벤트
      todoListContainer.addEventListener("dragend", function (event) {
        if (dragSrcEl) {
          dragSrcEl.classList.remove("dragging");
        }
        console.log("drag 종료");
      });

      // 드래그 오버 이벤트
      todoListContainer.addEventListener("dragover", function (event) {
        event.preventDefault(); // 기본 동작 방지
        event.dataTransfer.dropEffect = "move";
        console.log("dragover");
      });

      // 드롭 이벤트
      todoListContainer.addEventListener("drop", async function (event) {
        event.preventDefault();

        const dropTarget = event.target.closest(".todo-item");
        if (dragSrcEl && dropTarget && dragSrcEl !== dropTarget) {
          // 드래그된 요소와 드롭 타겟의 위치를 결정
          const boundingRect = dropTarget.getBoundingClientRect();
          const offsetY = event.clientY - boundingRect.top;

          if (offsetY < boundingRect.height / 2) {
            // 드롭 타겟의 위쪽에 삽입
            todoListContainer.insertBefore(dragSrcEl, dropTarget);
          } else {
            // 드롭 타겟의 아래쪽에 삽입
            todoListContainer.insertBefore(dragSrcEl, dropTarget.nextSibling);
          }

          // todos 배열을 새롭게 재정렬
          const reorderedTodos = [];
          const todoItems = document.querySelectorAll(".todo-item");

          todoItems.forEach((item, index) => {
            const todoId = item.querySelector("input[type='checkbox']").id;
            const originalTodo = todos.find((todo) => todo._id === todoId);
            if (originalTodo) {
              originalTodo.index = index + 1; // 새로운 순서를 배열에 업데이트
              reorderedTodos.push(originalTodo);
            }
          });

          console.log("Reordered todos:", reorderedTodos); // 디버깅을 위한 콘솔 출력

          // 서버에 업데이트된 순서를 전송
          try {
            const response = await fetch("/todos/update-order", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(reorderedTodos),
            });

            if (response.ok) {
              console.log("Todo list order updated successfully");
            } else {
              console.error("Failed to update todo list order");
            }
          } catch (error) {
            console.error("Error updating todo list order:", error);
          }
        }
      });
    }
  }

  // TODO 리스트의 데이터 가져오기
  async function getTodoListData(searchTerm = "") {
    try {
      const response = await fetch("/todos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          todos = await response.json(); // 전역 변수에 할 일 목록 할당

          let filteredTodos = todos;
          if (searchTerm) {
            // 검색어가 있는 경우 필터링
            filteredTodos = todos.filter((todo) =>
              todo.title.toLowerCase().includes(searchTerm)
            );
          }

          renderTodoList(filteredTodos);
          addTodoEventListeners();
        } else {
          console.error("Unexpected content-type:", contentType);
          alert("서버에서 받은 데이터 형식이 올바르지 않습니다.");
        }
      } else {
        console.error("Failed to fetch todos:", response.statusText);
        alert("서버로부터 데이터를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      alert("할일 목록을 가져오는 중 오류가 발생했습니다.");
    }
  }

  // 검색 입력에 대한 이벤트 리스너
  const schForm = document.getElementById("search-input");
  schForm.addEventListener("input", async () => {
    const searchTerm = schForm.value.toLowerCase().trim();
    getTodoListData(searchTerm);
  });

  // 추가 버튼 클릭 시
  document.getElementById("add-button").addEventListener("click", () => {
    openPopup("add");
  });

  // 팝업에서 Cancel 버튼 클릭 시 팝업 닫기
  document.getElementById("popup-close").addEventListener("click", closePopup);

  // 초기 TODO 리스트의 데이터 가져오기
  getTodoListData();
});

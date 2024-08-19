document.addEventListener("DOMContentLoaded", () => {
  let currentTodoId = null;

  // 팝업 열기 함수
  function openPopup(mode, todoData = null) {
    const popupElement = document.getElementById("popup");
    const rowGroupElements = document.querySelectorAll(".row-group");
    const popupTitleElement = document.getElementById("popup-title");
    const titleInputElement = document.getElementById("popup-title-input");
    const categoryInputElement = document.getElementById("todo-category");
    const contentTextareaElement = document.getElementById("popup-content");
    const idInputElement = document.getElementById("todo-id");

    // 제목과 설명 설정
    if (mode === "edit") {
      popupTitleElement.textContent = "Edit TODO";
      if (todoData) {
        titleInputElement.value = todoData.title || "";
        categoryInputElement.value = todoData.category || "";
        contentTextareaElement.value = todoData.content || "";
        idInputElement.value = todoData._id || ""; // Ensure _id is available in todoData
      }
    } else if (mode === "delete") {
      popupTitleElement.textContent = "DELETE TODO?";
      if (todoData) {
        titleInputElement.value = todoData.title || "";
        categoryInputElement.value = todoData.category || "";
        contentTextareaElement.value = todoData.content || "";
        idInputElement.value = todoData._id || ""; // Ensure _id is available in todoData
      }
    } else {
      popupTitleElement.textContent = "New TODO";
      titleInputElement.value = "";
      categoryInputElement.value = "";
      contentTextareaElement.value = "";
      idInputElement.value = "";
    }

    // 팝업 표시
    document.getElementById("popup-overlay").classList.remove("hidden");
    document.getElementById("popup").classList.remove("hidden");

    // Save 버튼 클릭 시 실행할 콜백 설정
    const saveButton = document.getElementById("popup-save");
    saveButton.onclick = async () => {
      const title = titleInputElement.value;
      const category = categoryInputElement.value;
      const content = contentTextareaElement.value;
      const id = idInputElement.value;

      if (mode === "edit") {
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
      } else if (mode === "delete") {
        const response = await fetch(`/todos/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          location.reload(); // 페이지 새로고침
        } else {
          console.error("Failed to update todo");
        }
      } else {
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
      }

      closePopup();
    };
  }

  // 팝업 닫기 함수
  function closePopup() {
    document.getElementById("popup-overlay").classList.add("hidden");
    document.getElementById("popup").classList.add("hidden");
  }

  // 수정 버튼 클릭 시
  document.querySelectorAll(".edit-button").forEach((button) => {
    button.addEventListener("click", function () {
      currentTodoId = this.dataset.id;

      fetch(`/todos/${currentTodoId}`)
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
    });
  });

  // 삭제 버튼 클릭 시
  document.querySelectorAll(".trash-button").forEach((button) => {
    button.addEventListener("click", function () {
      currentTodoId = this.dataset.id;

      fetch(`/todos/${currentTodoId}`)
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
    });
  });

  // 추가 버튼 클릭 시
  document.getElementById("add-button").addEventListener("click", () => {
    openPopup("add");
  });

  // 팝업에서 Cancel 버튼 클릭 시 팝업 닫기
  document.getElementById("popup-close").addEventListener("click", closePopup);
});

let taskCount = 0;

window.addEventListener("load", function() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(taskText => {
    addTask(taskText);
  });
  updateCounter();
});

document.getElementById("add-btn").addEventListener("click", function() {
  const input = document.getElementById("todo-input");
  const task = input.value.trim();
  if (task !== "") {
    addTask(task);
    taskCount++;
    updateCounter();
    saveTasks();
    input.value = "";
  }
});

function addTask(taskText) {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", function() {
    if (checkbox.checked) {
      if (taskCount > 0) taskCount--;
    } else {
      taskCount++;
    }
    updateCounter();
  });

  const span = document.createElement("span");
  span.textContent = taskText;

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", function() {
    editSpan(span, li, editBtn);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", function() {
    if (!checkbox.checked && taskCount > 0) {
      taskCount--;
    }
    li.remove();
    updateCounter();
    saveTasks();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  document.getElementById("todo-list").appendChild(li);
}

function editSpan(span, li, editBtn) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = span.textContent;
  input.className = "editing";

  li.insertBefore(input, editBtn);
  span.remove();
  editBtn.disabled = true;

  input.focus();

  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      saveEdit(input, li, editBtn);
    }
  });

  input.addEventListener("blur", function() {
    saveEdit(input, li, editBtn);
  });
}

function saveEdit(input, li, editBtn) {
  const newSpan = document.createElement("span");
  newSpan.textContent = input.value.trim() !== "" ? input.value.trim() : "Untitled";

  li.insertBefore(newSpan, editBtn);
  input.remove();
  editBtn.disabled = false;
  saveTasks();
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#todo-list li span").forEach(span => {
    tasks.push(span.textContent);
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCounter() {
  if (taskCount < 0) taskCount = 0;
  document.getElementById("task-counter").textContent = `${taskCount} todos remaining`;
}


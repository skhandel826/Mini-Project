const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskContainer = document.getElementById("taskContainer");
const resetBtn = document.getElementById("resetBtn");
const toggleTheme = document.getElementById("toggleTheme");
const dateDisplay = document.getElementById("dateDisplay");
const datePicker = document.getElementById("datePicker");
const filterBtns = document.querySelectorAll(".filterBtn");

let selectedDateKey = "";

datePicker.addEventListener("change", () => {
  const newDate = new Date(datePicker.value);
  localStorage.setItem("selectedDate", newDate.toISOString());
  selectedDateKey = newDate.toISOString().split("T")[0];

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  dateDisplay.innerText = `${dayNames[newDate.getDay()]}, ${newDate.toLocaleDateString()}`;
  loadTasks();
});

function showDate() {
  const savedDate = localStorage.getItem("selectedDate");
  let date = savedDate ? new Date(savedDate) : new Date();
  selectedDateKey = date.toISOString().split("T")[0];

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  dateDisplay.innerText = `${dayNames[date.getDay()]}, ${date.toLocaleDateString()}`;
  datePicker.valueAsDate = date;

  loadTasks();
}

function saveTasksForDate(date, html) {
  localStorage.setItem(`tasks-${date}`, html);
}

function loadTasks() {
  taskContainer.innerHTML = "";

  const allKeys = Object.keys(localStorage).filter(k => k.startsWith("tasks-"));
  const dates = [...new Set(allKeys.map(k => k.split("-").slice(1).join("-")))].sort();

  dates.forEach(date => {
    const tasksHTML = localStorage.getItem(`tasks-${date}`);
    if (!tasksHTML) return;

    const section = document.createElement("div");
    section.className = "task-section";
    const readableDate = new Date(date);
    const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][readableDate.getDay()];
    section.innerHTML = `<h2>${day}, ${readableDate.toLocaleDateString()}</h2><ul id="list-${date}">${tasksHTML}</ul>`;
    taskContainer.appendChild(section);

    addTaskEvents(section.querySelector(`#list-${date}`));
  });
}

function addTaskEvents(list) {
  list.querySelectorAll(".task-checkbox").forEach(box => {
    box.addEventListener("change", function () {
      this.parentElement.classList.toggle("completed", this.checked);
      const date = list.id.replace("list-", "");
      saveTasksForDate(date, list.innerHTML);
    });
  });

  list.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", function () {
      this.parentElement.remove();
      const date = list.id.replace("list-", "");
      saveTasksForDate(date, list.innerHTML);
    });
  });

  list.querySelectorAll(".task-text").forEach(span => {
    span.addEventListener("dblclick", function () {
      const newText = prompt("Edit task:", this.innerText);
      if (newText !== null && newText.trim() !== "") {
        this.innerText = newText.trim();
        const date = list.id.replace("list-", "");
        saveTasksForDate(date, list.innerHTML);
      }
    });
  });
}

addBtn.addEventListener("click", () => {
  const task = taskInput.value.trim();
  if (task === "") return;

  const listId = `list-${selectedDateKey}`;
  let list = document.getElementById(listId);

  if (!list) {
    const section = document.createElement("div");
    section.className = "task-section";
    const date = new Date(selectedDateKey);
    const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()];
    section.innerHTML = `<h2>${day}, ${date.toLocaleDateString()}</h2><ul id="${listId}"></ul>`;
    taskContainer.appendChild(section);
    list = section.querySelector("ul");
  }

  const li = document.createElement("li");
  li.innerHTML = `
    <input type="checkbox" class="task-checkbox" />
    <span class="task-text">${task}</span>
    <button class="deleteBtn">❌</button>
  `;
  list.appendChild(li);
  taskInput.value = "";

  addTaskEvents(list);
  saveTasksForDate(selectedDateKey, list.innerHTML);
});

resetBtn.addEventListener("click", () => {
  if (confirm("Clear all tasks for this date?")) {
    localStorage.removeItem(`tasks-${selectedDateKey}`);
    loadTasks();
  }
});

toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

function applyTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") document.body.classList.add("dark");
}

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.getAttribute("data-filter");
    document.querySelectorAll("ul").forEach(list => {
      list.querySelectorAll("li").forEach(task => {
        const isCompleted = task.classList.contains("completed");
        task.style.display =
          filter === "all" ||
          (filter === "completed" && isCompleted) ||
          (filter === "pending" && !isCompleted)
            ? "flex"
            : "none";
      });
    });
  });
});

window.onload = () => {
  showDate();
  applyTheme();
};

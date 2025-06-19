// DOM Elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// Load tasks from localStorage
document.addEventListener("DOMContentLoaded", () => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => addTaskToDOM(task));
});

// Add a new task
addBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const task = { text: taskText, completed: false };
        addTaskToDOM(task);
        saveTaskToLocalStorage(task);
        taskInput.value = "";
    }
});

// Add task to the DOM with animations
function addTaskToDOM(task) {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;
    li.style.opacity = "0"; // Start invisible for fade-in
    
    li.innerHTML = `
        <span>${task.text}</span>
        <button class="deleteBtn">Delete</button>
    `;
    
    taskList.appendChild(li);
    
    // Fade-in animation
    setTimeout(() => {
        li.style.opacity = "1";
        li.style.transform = "translateY(0)";
    }, 10);
    
    // Toggle completed status
    li.querySelector("span").addEventListener("click", () => {
        li.classList.toggle("completed");
        updateLocalStorage();
    });

    // Delete with slide-out animation
    li.querySelector(".deleteBtn").addEventListener("click", () => {
        li.classList.add("deleting");
        setTimeout(() => {
            li.remove();
            updateLocalStorage();
        }, 300);
    });
}

// Save task to localStorage
function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update localStorage when tasks change
function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll(".task").forEach(taskEl => {
        tasks.push({
            text: taskEl.querySelector("span").textContent,
            completed: taskEl.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
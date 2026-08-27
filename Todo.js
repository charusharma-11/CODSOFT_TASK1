let tasks = JSON.parse(localStorage.getItem("charuTodoTasks")) || [];

const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const priorityInput = document.getElementById("priorityInput");
const dateInput = document.getElementById("dateInput");

const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");
const filterInput = document.getElementById("filterInput");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const emptyMessage = document.getElementById("emptyMessage");
const themeBtn = document.getElementById("themeBtn");


// ==============================
// SAVE TASKS
// ==============================

function saveTasks() {
    localStorage.setItem("charuTodoTasks", JSON.stringify(tasks));
}


// ==============================
// ADD TASK
// ==============================

function addTask() {

    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task.");
        taskInput.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        title: title,
        category: categoryInput.value,
        priority: priorityInput.value,
        date: dateInput.value,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";
    dateInput.value = "";

    renderTasks();
}


// ==============================
// RENDER TASKS
// ==============================

function renderTasks() {

    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const filter = filterInput.value;

    let filteredTasks = tasks.filter(function(task) {

        const matchesSearch =
            task.title.toLowerCase().includes(searchText);

        let matchesFilter = true;

        if (filter === "pending") {
            matchesFilter = !task.completed;
        }

        if (filter === "completed") {
            matchesFilter = task.completed;
        }

        if (filter === "high") {
            matchesFilter = task.priority === "High";
        }

        return matchesSearch && matchesFilter;
    });


    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";


    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }


        const taskMain = document.createElement("div");
        taskMain.className = "task-main";


        const title = document.createElement("div");
        title.className = "task-title";
        title.textContent = task.title;


        const details = document.createElement("div");
        details.className = "task-details";


        const category = document.createElement("span");
        category.className = "badge";
        category.textContent = task.category;


        const priority = document.createElement("span");
        priority.className = "badge";


        if (task.priority === "High") {
            priority.classList.add("priority-high");
        }

        if (task.priority === "Medium") {
            priority.classList.add("priority-medium");
        }

        if (task.priority === "Low") {
            priority.classList.add("priority-low");
        }

        priority.textContent = task.priority;


        details.appendChild(category);
        details.appendChild(priority);


        if (task.date) {

            const date = document.createElement("span");

            date.className = "badge";

            date.textContent = "Due: " + task.date;

            details.appendChild(date);
        }


        taskMain.appendChild(title);
        taskMain.appendChild(details);


        // Actions

        const actions = document.createElement("div");

        actions.className = "actions";


        const completeBtn = document.createElement("button");

        completeBtn.className = "complete-btn";

        completeBtn.textContent =
            task.completed ? "Undo" : "Done";


        completeBtn.onclick = function() {
            toggleTask(task.id);
        };


        const editBtn = document.createElement("button");

        editBtn.className = "edit-btn";

        editBtn.textContent = "Edit";

        editBtn.onclick = function() {
            editTask(task.id);
        };


        const deleteBtn = document.createElement("button");

        deleteBtn.className = "delete-btn";

        deleteBtn.textContent = "Delete";

        deleteBtn.onclick = function() {
            deleteTask(task.id);
        };


        actions.appendChild(completeBtn);
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);


        li.appendChild(taskMain);
        li.appendChild(actions);

        taskList.appendChild(li);
    });


    updateStats();
}


// ==============================
// COMPLETE / UNDO
// ==============================

function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();

    renderTasks();
}


// ==============================
// EDIT TASK
// ==============================

function editTask(id) {

    const task = tasks.find(function(task) {
        return task.id === id;
    });

    if (!task) return;


    const newTitle = prompt(
        "Edit your task:",
        task.title
    );


    if (newTitle === null) {
        return;
    }


    if (newTitle.trim() === "") {
        alert("Task cannot be empty.");
        return;
    }


    task.title = newTitle.trim();

    saveTasks();

    renderTasks();
}


// ==============================
// DELETE TASK
// ==============================

function deleteTask(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this task?");


    if (!confirmDelete) {
        return;
    }


    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });


    saveTasks();

    renderTasks();
}


// ==============================
// STATISTICS
// ==============================

function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(function(task) {
            return task.completed;
        }).length;

    const pending = total - completed;


    totalCount.textContent = total;

    completedCount.textContent = completed;

    pendingCount.textContent = pending;
}


// ==============================
// SEARCH
// ==============================

searchInput.addEventListener(
    "input",
    renderTasks
);


// ==============================
// FILTER
// ==============================

filterInput.addEventListener(
    "change",
    renderTasks
);


// ==============================
// ADD BUTTON
// ==============================

addBtn.addEventListener(
    "click",
    addTask
);


// ==============================
// ENTER KEY
// ==============================

taskInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            addTask();
        }

    }
);


// ==============================
// DARK MODE
// ==============================

themeBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            themeBtn.textContent = "☀️";

            localStorage.setItem(
                "todoTheme",
                "dark"
            );

        } else {

            themeBtn.textContent = "🌙";

            localStorage.setItem(
                "todoTheme",
                "light"
            );
        }
    }
);


// ==============================
// LOAD THEME
// ==============================

const savedTheme =
    localStorage.getItem("todoTheme");


if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";
}


// ==============================
// INITIAL LOAD
// ==============================

renderTasks();

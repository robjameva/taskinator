var taskIdCounter = 0;
var formEl = document.querySelector("#task-form")
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProjgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");
var tasks = [];


var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");


    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        comppleteEditTask(taskNameInput, taskTypeInput, taskId);
    }

    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };
    }
    createTeskEl(taskDataObj);
}

var createTeskEl = function (taskDataObj) {
    // Create list-item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // Add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter)

    // Create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    // Add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    saveTasks();

    taskIdCounter++;
}

var createTaskActions = function (taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // Create edit button
    var editButtenEL = document.createElement("button");
    editButtenEL.textContent = "Edit";
    editButtenEL.className = "btn edit-btn";
    editButtenEL.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtenEL);

    // Create delte button
    var deleteButtunEl = document.createElement("button");
    deleteButtunEl.textContent = "Delete";
    deleteButtunEl.className = "btn delete-btn";
    deleteButtunEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtunEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
    }
    return actionContainerEl;
}


var taskButtonHandler = function (event) {
    var targetEl = event.target;

    if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }

    else if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
};

var deleteTask = function (taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    var updatedTaskArr = [];

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== parseInt(taskId)) {
            tasks[i].status = statusValue;
            updatedTaskArr.push(tasks[i])
        }
    }

    tasks = updatedTaskArr;
    saveTasks();
};

var editTask = function (taskId) {

    // Get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    formEl.setAttribute("data-task-id", taskId);

    document.querySelector("#save-task").textContent = "Save Task";
};

var comppleteEditTask = function (taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    alert("Task Updated!")

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
    saveTasks();
};

var taskStatusChangeHandler = function (event) {
    var taskId = event.target.getAttribute("data-task-id");
    var statusValue = event.target.value.toLowerCase();
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProjgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    saveTasks();
};

var saveTasks = function () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function () {
    // get tasks from local storage
    var savedTasks = localStorage.getItem("tasks");

    // Conver tasks from string fromat back to array
    if (savedTasks === null) {
        return false;
    }

    savedTasks = JSON.parse(savedTasks);

    for (var i = 0; i < savedTasks.length; i++) {
        createTeskEl(savedTasks[i]);
    }
}

formEl.addEventListener("submit", taskFormHandler)
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);







loadTasks();
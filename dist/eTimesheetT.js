// Mock Setup
const firebaseMock = {
  initializeApp: jest.fn(),
  getDatabase: jest.fn(() => ({
    ref: jest.fn(() => ({
      on: jest.fn(),
      once: jest.fn(),
      push: jest.fn(),
      remove: jest.fn()
    })),
    on: jest.fn(),
    onValue: jest.fn(),
    push: jest.fn(),
    child: jest.fn(),
    remove: jest.fn()
  })),
  ref: jest.fn(),
  onValue: jest.fn(), 
};

// Initialize Firebase
const app = firebaseMock.initializeApp();
const database = firebaseMock.getDatabase();
const tasksRef = firebaseMock.ref(database, 'tasks');

// Function to showAlert
function showAlert(message, className) {
  const div = document.createElement("div");
  div.className = `alert alert-${className}`;
  div.appendChild(document.createTextNode(message));
  const body = document.querySelector("body");
  body.insertBefore(div, body.firstChild);
  setTimeout(() => document.querySelector(".alert").remove(), 3000);
}

// Function to calculate task duration
function calculateDuration(startTime, endTime) {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const diff = (end - start) / 1000; // in seconds
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
}

// Function to add a new task
function addTask() {
  const employeeName = document.querySelector("#employeeName").value;
  const employeeEmail = document.querySelector("#employeeEmail").value;
  const task = document.querySelector("#task").value;
  const date = document.querySelector("#date").value;
  const startTime = document.querySelector("#startTime").value;
  const endTime = document.querySelector("#endTime").value;

  let status = "";
  const inProgressRadio = document.querySelector("#status2");
  const completedRadio = document.querySelector("#status3");
  if (inProgressRadio.checked) {
    status = "In Progress";
  } else if (completedRadio.checked) {
    status = "Completed";
  }
  const tasksRef = firebaseMock.ref('tasks');

  tasksRef.push( {
    employeeName,
    employeeEmail,
    task,
    date,
    duration: calculateDuration(startTime, endTime),
    status
  });

  showAlert("Task Added!", "success");

  document.querySelector("#employeeName").value = "";
  document.querySelector("#employeeEmail").value = "";
  document.querySelector("#task").value = "";
  document.querySelector("#date").value = "";
  document.querySelector("#startTime").value = "";
  document.querySelector("#endTime").value = "";
  inProgressRadio.checked = false;
  completedRadio.checked = false;
}

// Function to delete a task
function deleteTask(taskId) {
  const tasksRef = firebaseMock.ref('tasks');
  const taskref = firebaseMock.ref(database, `tasks/${taskId}`);
  taskref.remove();
  showAlert("Task Deleted!", "danger");
}

// Function to load tasks from Firebase database based on user's email
function loadTasksFromFirebase(email) {
  const tableBody = document.querySelector("#task-list");
  tableBody.innerHTML = ""; // Clear existing tasks

  firebaseMock.onValue(tasksRef,  (snapshot) => {
    const tasks = snapshot.val();
    if (tasks) {
      Object.keys(tasks).forEach((taskId) => {
        const task = tasks[taskId];
        if (task.employeeEmail === email) {
          const newRow = document.createElement("tr");
          newRow.innerHTML = `
            <td>${task.employeeName}</td>
            <td>${task.employeeEmail}</td>
            <td>${task.task}</td>
            <td>${task.date}</td>
            <td>${task.duration}</td>
            <td>${task.status}</td>
            <td>
              <button class="btn btn-warning btn-sm edit" data-id="${taskId}">Edit</button>
              <button class="btn btn-danger btn-sm delete" data-id="${taskId}">Delete</button>
            </td>
          `;
          tableBody.appendChild(newRow);
        }
      });
    } else {
      showAlert("No tasks found!", "info");
    }
  });
}

// Function to handle form submission
async function handleSubmit(e) {
  e.preventDefault();
  const email = document.querySelector("#userEmail").value;
  if (email) {
    loadTasksFromFirebase(email);
  } else {
    showAlert("Please enter an email address.", "danger");
  }
}

// Add event listeners if elements exist
const retrieveTimesheetForm = document.querySelector("#retrieveTimesheetForm");
if (retrieveTimesheetForm) {
  retrieveTimesheetForm.addEventListener("submit", handleSubmit);
}

const downloadPDFButton = document.querySelector("#downloadPDF");
if (downloadPDFButton) {
  downloadPDFButton.addEventListener("click", () => {
    downloadTimesheet("pdf");
  });
}

const downloadCSVButton = document.querySelector("#downloadCSV");
if (downloadCSVButton) {
  downloadCSVButton.addEventListener("click", () => {
    downloadTimesheet("csv");
  });
}

// Event listener for editing a task
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    const taskId = e.target.dataset.id;
    firebaseMock.child(tasksRef, taskId).once("value", (snapshot) => {
      const task = snapshot.val();
      document.querySelector("#employeeName").value = task.employeeName;
      document.querySelector("#employeeEmail").value = task.employeeEmail;
      document.querySelector("#task").value = task.task;
      document.querySelector("#date").value = task.date;
      const inProgressRadio = document.querySelector("#status2");
      const completedRadio = document.querySelector("#status3");
      if (task.status === "In Progress") {
        inProgressRadio.checked = true;
      } else if (task.status === "Completed") {
        completedRadio.checked = true;
      }
    });
  }
});

// Event listener for deleting a task
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    const taskId = e.target.dataset.id;
    deleteTask(taskId);
  }
});

// Function to download timesheet in the specified format
function downloadTimesheet(format) {
  const table = document.querySelector("#task-list");
  const rows = table.querySelectorAll("tr");
  if (format === "csv") {
    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach((row) => {
      let rowData = [];
      row.querySelectorAll("td").forEach((cell, index) => {
        if (index !== row.cells.length - 2 && index !== row.cells.length - 1) {
          rowData.push(cell.textContent);
        }
      });
      csvContent += rowData.join(",") + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "timesheet.csv");
    document.body.appendChild(link);
    link.click();
  }
}

module.exports = {
  addTask,
  deleteTask,
  loadTasksFromFirebase,
  showAlert,
  calculateDuration,
  handleSubmit,
  downloadTimesheet,
  firebaseMock
};

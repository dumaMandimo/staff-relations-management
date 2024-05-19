import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCvnZkbqON0vsIackr90txDbg-oYj_ikJ0",
    authDomain: "staff-relations-databases.firebaseapp.com",
    databaseURL: "https://staff-relations-databases-default-rtdb.firebaseio.com",
    projectId: "staff-relations-databases",
    storageBucket: "staff-relations-databases.appspot.com",
    messagingSenderId: "356187917991",
    appId: "1:356187917991:web:e2cd5bd697464c873a9582",
    measurementId: "G-42THPFZ5QD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const tasksRef = ref(database, 'tasks');

// Function to get the current user's email
async function getUserEmail() {
    fetch('/userinfo').then((response) => {
      return response.json();
    }).then((data) => {
      return console.log(data.email);
    });
}

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
async function addTask() {
    const employeeName = document.querySelector("#employeeName").value;
    const task = document.querySelector("#task").value;
    const date = document.querySelector("#date").value;
    const startTime = document.querySelector("#startTime").value;
    const endTime = document.querySelector("#endTime").value;

    // Retrieve selected status from radio buttons
    let status = "";
    const inProgressRadio = document.querySelector("#status2");
    const completedRadio = document.querySelector("#status3");

    if (inProgressRadio.checked) {
        status = inProgressRadio.nextElementSibling.textContent.trim();
    } else if (completedRadio.checked) {
        status = completedRadio.nextElementSibling.textContent.trim();
    }

    // Save task to Firebase database
    push(tasksRef, {
        employeeName: employeeName,
        task: task,
        date: date,
        duration: calculateDuration(startTime, endTime),
        status: status
    });

    // Show success alert
    showAlert("Task Added!", "success");

    // Clear input fields
    document.querySelector("#employeeName").value = "";
    document.querySelector("#task").value = "";
    document.querySelector("#date").value = "";
    document.querySelector("#startTime").value = "";
    document.querySelector("#endTime").value = "";
    inProgressRadio.checked = false;
    completedRadio.checked = false;
}

// Function to delete a task
function deleteTask(taskId) {
    remove(ref(database, `tasks/${taskId}`));

    showAlert("Task Deleted!", "danger");
}

// Function to load tasks from Firebase database
function loadTasksFromFirebase() {
    onValue(tasksRef, (snapshot) => {
        const tasks = snapshot.val();
        if (tasks) {
            Object.keys(tasks).forEach((taskId) => {
                const task = tasks[taskId];
                const newRow = document.createElement("tr");
                newRow.innerHTML = `
                    <td>${task.employeeName}</td>
                    <td>${task.task}</td>
                    <td>${task.date}</td>
                    <td>${task.duration}</td>
                    <td>${task.status}</td>
                    <td>
                        <button class="btn btn-warning btn-sm edit">Edit</button>
                        <button class="btn btn-danger btn-sm delete" data-id="${taskId}">Delete</button>
                    </td>
                `;
                document.querySelector("#task-list").appendChild(newRow);
            });
        }
    });
}

// Event listener for delete buttons
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        const taskId = e.target.dataset.id;
        deleteTask(taskId);
    }
});

// Load tasks from Firebase database when the page loads
document.addEventListener("DOMContentLoaded", () => {
    loadTasksFromFirebase();
});

// Event listener for adding a task
document.querySelector("#addTask").addEventListener("click", () => {
    addTask();
});
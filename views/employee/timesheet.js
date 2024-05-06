//alerts
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
        const employeeId = document.querySelector("#employeeId").value;
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

        // Create new row with task details
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
                <td>${employeeId}</td>
                <td>${task}</td>
                <td>${date}</td>
                <td>${calculateDuration(startTime, endTime)}</td>
                <td>${status}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit">Edit</button>
                    <button class="btn btn-danger btn-sm delete">Delete</button>
                </td>
            `;

        // Append new row to task list table
        document.querySelector("#task-list").appendChild(newRow);

        // Show success alert
        showAlert("Task Added!", "success");

        // Clear input fields
        document.querySelector("#employeeId").value = "";
        document.querySelector("#task").value = "";
        document.querySelector("#date").value = "";
        document.querySelector("#startTime").value = "";
        document.querySelector("#endTime").value = "";
        inProgressRadio.checked = false;
        completedRadio.checked = false;

        // Save tasks to local storage
        saveTasksToLocalStorage();
      }

      // Function to delete a task
      function deleteTask(row) {
        row.remove();
        showAlert("Task Deleted!", "danger");

        saveTasksToLocalStorage();
      }

      // Function to save tasks to local storage
      function saveTasksToLocalStorage() {
        const taskRows = document.querySelectorAll("#task-list tr");
        const tasks = [];
        taskRows.forEach((row) => {
          const taskData = {
            employeeId: row.cells[0].textContent,
            task: row.cells[1].textContent,
            date: row.cells[2].textContent,
            duration: row.cells[3].textContent,
            status: row.cells[4].textContent,
          };
          tasks.push(taskData);
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
      }

      // Function to load tasks from local storage
      function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        if (tasks) {
          tasks.forEach((task) => {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                        <td>${task.employeeId}</td>
                        <td>${task.task}</td>
                        <td>${task.date}</td>
                        <td>${task.duration}</td>
                        <td>${task.status}</td>
                        <td>
                            <button class="btn btn-warning btn-sm edit">Edit</button>
                            <button class="btn btn-danger btn-sm delete">Delete</button>
                        </td>
                    `;
            document.querySelector("#task-list").appendChild(newRow);
          });
        }
      }

      // Function to edit a task
      function editTask(row) {
        const cells = row.cells;
        const employeeId = cells[0].textContent;
        const task = cells[1].textContent;
        const date = cells[2].textContent;
        const duration = cells[3].textContent;
        const status = cells[4].textContent;

        // Populate form fields with task data
        document.querySelector("#employeeId").value = employeeId;
        document.querySelector("#task").value = task;
        document.querySelector("#date").value = date;

        // Split duration into hours and minutes
        const [hours, minutes] = duration.split(":");
        document.querySelector("#startTime").value = hours;
        document.querySelector("#endTime").value = minutes;

        // Set status radio button based on task status
        const inProgressRadio = document.querySelector("#status2");
        const completedRadio = document.querySelector("#status3");
        if (status === "In Progress") {
          inProgressRadio.checked = true;
        } else if (status === "Completed") {
          completedRadio.checked = true;
        }

        // Delete the row after editing
        deleteTask(row);
      }

      // Event listener for delete buttons
      document.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete")) {
          const row = e.target.closest("tr");
          deleteTask(row);
        } else if (e.target.classList.contains("edit")) {
          const row = e.target.closest("tr");
          editTask(row);
        }
      });

      // Load tasks from local storage when the page loads
      document.addEventListener("DOMContentLoaded", () => {
        loadTasksFromLocalStorage();
      });

      // Event listener for adding a task
      document.querySelector("#addTask").addEventListener("click", () => {
        addTask();
      });


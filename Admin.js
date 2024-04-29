function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    if (sidebar.style.transform === 'translateX(0)') {
      sidebar.style.transform = 'translateX(-100%)';
    } else {
      sidebar.style.transform = 'translateX(0)';
    }
}

function showDashboard() {
    var center = document.getElementById('center');
    center.innerHTML = '<h1>Welcome to Admin Dashboard</h1>';
}

function showTasks() {
    var center = document.getElementById('center');
    center.innerHTML = '<h2>Tasks</h2><p>List of tasks will be displayed here.</p>';
}

function showEmployees() {
    var center = document.getElementById('center');
    center.innerHTML = `
        <h2>Employee Overview</h2>
        <table id="employeeTable">
            <thead>
                <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <!-- Table rows will be dynamically added here -->
            </tbody>
        </table>
        <form id="addEmployeeForm">
            <input type="text" id="employeeId" placeholder="Employee ID" required>
            <input type="text" id="employeeName" placeholder="Name" required>
            <input type="text" id="employeeDepartment" placeholder="Department" required>
            <button type="submit">Add Employee</button>
        </form>
    `;
    displayEmployees(); // Call a function to populate the table with existing employees
}

function showMessages() {
    var center = document.getElementById('center');
    center.innerHTML = '<h2>Messages</h2><p>List of messages will be displayed here.</p>';
}

function showMeetings() {
    var center = document.getElementById('center');
    center.innerHTML = '<h2>Meetings</h2><p>List of meetings will be displayed here.</p>';
}

function showTimesheets() {
    var center = document.getElementById('center');
    center.innerHTML = '<h2>Meetings</h2><p>Timesheet will be displayed here.</p>';
}

// JavaScript code to handle adding and removing employees in the employee section
document.addEventListener('DOMContentLoaded', function () {
    // Function to display employees in the table
    function displayEmployees() {
        const tableBody = document.querySelector("#employeeTable tbody");
        tableBody.innerHTML = ""; // Clear existing rows

        // Iterate over the employees array and add rows to the table
        employees.forEach((employee, index) => {
            const row = `
              <tr>
                <td>${employee.id}</td>
                <td>${employee.name}</td>
                <td>${employee.department}</td>
                <td><button class="removeBtn" data-index="${index}">Remove</button></td>
              </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    // Function to add employee
    function addEmployee(employee) {
        employees.push(employee);
        displayEmployees();
    }

    // Function to remove employee
    function removeEmployee(index) {
        employees.splice(index, 1);
        displayEmployees();
    }

    // Event listener for form submission to add employee
    document.getElementById("addEmployeeForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const employeeId = document.getElementById("employeeId").value;
        const employeeName = document.getElementById("employeeName").value;
        const employeeDepartment = document.getElementById("employeeDepartment").value;

        // Add the employee
        addEmployee({ id: employeeId, name: employeeName, department: employeeDepartment });

        // Clear form fields
        this.reset();
    });

    // Event delegation for remove buttons
    document.getElementById("employeeTable").addEventListener("click", function (event) {
        if (event.target.classList.contains("removeBtn")) {
            const index = event.target.dataset.index;
            removeEmployee(index);
        }
    });

    // Initial display of employees
    displayEmployees();
});

// Function to show the timesheet section
function showTimesheet() {
    var center = document.getElementById('center');
    center.innerHTML = `
      <div id="timesheetSection">
        <h2>Timesheet</h2>
        <form id="timesheetForm">
          <label for="date">Date:</label>
          <input type="date" id="date" required>
          <label for="hoursWorked">Hours Worked:</label>
          <input type="number" id="hoursWorked" min="0" required>
          <button type="submit">Submit</button>
        </form>
        <table id="timesheetTable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Hours Worked</th>
            </tr>
          </thead>
          <tbody>
            <!-- Table rows will be dynamically added here -->
          </tbody>
        </table>
        <button id="generateTimesheetBtn">Generate Timesheet</button>
      </div>
    `;
  
    // Initialize timesheet functionality
    initializeTimesheet();
  }
  
  // Function to initialize timesheet functionality
  function initializeTimesheet() {
    const timesheetForm = document.getElementById('timesheetForm');
    const timesheetTable = document.getElementById('timesheetTable');
    const generateTimesheetBtn = document.getElementById('generateTimesheetBtn');
    const timesheetData = [];
  
    // Function to display timesheet data in the table
    function displayTimesheetData() {
      timesheetTable.innerHTML = ""; // Clear existing rows
  
      // Iterate over the timesheet data array and add rows to the table
      timesheetData.forEach(entry => {
        const row = `
          <tr>
            <td>${entry.date}</td>
            <td>${entry.hoursWorked}</td>
          </tr>
        `;
        timesheetTable.innerHTML += row;
      });
    }
  
    // Function to handle form submission
    timesheetForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const date = document.getElementById('date').value;
      const hoursWorked = parseInt(document.getElementById('hoursWorked').value);
  
      // Add the timesheet entry to the timesheet data array
      timesheetData.push({ date, hoursWorked });
      displayTimesheetData();
      this.reset(); // Clear form fields
    });
  
    // Event listener for generating the timesheet
    generateTimesheetBtn.addEventListener('click', function () {
      // Prepare the timesheet data for display or export
      // Here, you can implement logic to generate the timesheet report
      console.log(timesheetData);
      alert('Timesheet generated! Check console for details.');
    });
  }
  
// Function to show the meals section
function showMeals() {
    var center = document.getElementById('center');
    center.innerHTML = `
      <div id="mealsSection">
        <h2>Meals</h2>
        <form id="mealForm">
          <label for="mealName">Meal Name:</label>
          <input type="text" id="mealName" required>
          <label for="assignedEmployee">Assigned Employee:</label>
          <select id="assignedEmployee" required>
            <option value="">Select Employee</option>
            <!-- Add employee options dynamically here -->
          </select>
          <button type="submit">Create Meal</button>
        </form>
        <ul id="mealList">
          <!-- Meal items will be dynamically added here -->
        </ul>
      </div>
    `;
  
    // Initialize meals functionality
    initializeMeals();
  }
  
  // Function to initialize meals functionality
  function initializeMeals() {
    const mealForm = document.getElementById('mealForm');
    const mealList = document.getElementById('mealList');
    const assignedEmployeeSelect = document.getElementById('assignedEmployee');
    const meals = [];
  
    // Function to display meals in the list
    function displayMeals() {
      mealList.innerHTML = ""; // Clear existing list
  
      // Iterate over the meals array and add items to the list
      meals.forEach(meal => {
        const item = document.createElement('li');
        item.textContent = `${meal.name} (Assigned to: ${meal.assignedEmployee})`;
        mealList.appendChild(item);
      });
    }
  
    // Function to handle form submission
    mealForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const mealName = document.getElementById('mealName').value;
      const assignedEmployee = assignedEmployeeSelect.value;
  
      // Create the meal object and add it to the meals array
      meals.push({ name: mealName, assignedEmployee });
      displayMeals();
      this.reset(); // Clear form fields
    });
  
    // Populate the assigned employee select options
    // You can replace this with actual employee data from your system
    function populateEmployeeOptions() {
      const employees = ['Employee 1', 'Employee 2', 'Employee 3']; // Example employee names
      employees.forEach(employee => {
        const option = document.createElement('option');
        option.textContent = employee;
        option.value = employee;
        assignedEmployeeSelect.appendChild(option);
      });
    }
  
    // Call the function to populate employee options
    populateEmployeeOptions();
  }
  
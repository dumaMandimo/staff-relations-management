// employee.js

// Sample data for roles and permissions
const roles = ['Admin', 'Manager', 'Employee'];
const permissions = ['View Reports', 'Manage Employees', 'Manage Inventory'];

// DOM elements
const employeeTable = document.getElementById('employeeTable');
const newEmployeeForm = document.getElementById('newEmployeeForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const roleSelect = document.getElementById('roleSelect');
const permissionsSelect = document.getElementById('permissionsSelect');

// Populate role and permissions options
populateOptions(roleSelect, roles);
populateOptions(permissionsSelect, permissions);

// Function to populate options
function populateOptions(select, options) {
  select.innerHTML = '';
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });
}

// Function to create a new employee
function createEmployee(e) {
  e.preventDefault();

  const name = nameInput.value;
  const email = emailInput.value;
  const role = roleSelect.value;
  const selectedPermissions = Array.from(permissionsSelect.selectedOptions).map(option => option.value);

  const employee = {
    name,
    email,
    role,
    permissions: selectedPermissions
  };

  saveEmployee(employee); // Replace with your implementation
  clearForm();
  renderEmployees(); // Render the updated employee list
}

// Function to clear the form inputs
function clearForm() {
  nameInput.value = '';
  emailInput.value = '';
  roleSelect.value = roles[0];
  permissionsSelect.selectedIndex = -1;
}


// Function to render the employee list
function renderEmployees() {
  // Replace with your implementation to fetch employees from the data source
  const employees = [
    { id: 1, name: 'Nicki Minaj', email: 'pink@example.com', role: 'Admin', permissions: ['View Reports', 'Manage Employees', 'Manage Inventory'] },
    { id: 2, name: 'Lana Del Rey', email: 'black@example.com', role: 'Manager', permissions: ['View Reports', 'Manage Inventory'] },
    { id: 3, name: 'Donald Trump', email: 'red@example.com', role: 'Employee', permissions: ['View Reports'] }
  ];

  const tbody = employeeTable.querySelector('tbody');
  tbody.innerHTML = '';

  employees.forEach(employee => {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${employee.name}</td>
    <td>${employee.surname}</td>
    <td>${employee.email}</td>
    <td>${employee.role}</td>
    <td>${employee.permissions.join(', ')}</td>
    <td>
      <button onclick="editEmployee(${employee.id})">Edit</button>
      <button class="delete" onclick="deleteEmployee(${employee.id})">Delete</button>
    </td>
  `;
    tbody.appendChild(row);
  });
}

// Add event listener to the form submission
newEmployeeForm.addEventListener('submit', createEmployee);

// Render the initial employee list
renderEmployees();
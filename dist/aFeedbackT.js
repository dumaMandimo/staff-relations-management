"use strict";

// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCvnZkbqON0vsIackr90txDbg-oYj_ikJ0",
  authDomain: "staff-relations-databases.firebaseapp.com",
  databaseURL: "https://staff-relations-databases-default-rtdb.firebaseio.com",
  projectId: "staff-relations-databases",
  storageBucket: "staff-relations-databases.appspot.com",
  messagingSenderId: "356187917991",
  appId: "1:356187917991:web:e2cd5bd697464c873a9582",
  measurementId: "G-42THPFZ5QD"
};

// Mock Firebase methods
const firebaseMock = {
  initializeApp: jest.fn(),
  getDatabase: jest.fn(() => ({
    ref: jest.fn(() => ({
      onValue: jest.fn()
    })),
    onValue: jest.fn(),
    push: jest.fn()
  }))
};

// Initialize Firebase
var app = firebaseMock.initializeApp(firebaseConfig);
var db = firebaseMock.getDatabase(app);

// Function to fetch and display employees who haven't sent feedback
function fetchAndDisplayEmployees(onValue, employeesRef, feedbackRef, document) {
  // Get table body element
  var tableBody = document.getElementById('feedbackTable').getElementsByTagName('tbody')[0];

  // Fetch employees and feedback data
  onValue(employeesRef, function (employeesSnapshot) {
    onValue(feedbackRef, function (feedbackSnapshot) {
      // Clear the existing table rows
      tableBody.innerHTML = '';

      // Get feedback sender IDs
      var feedbackSenders = new Set();
      feedbackSnapshot.forEach(function (feedbackChild) {
        feedbackSenders.add(feedbackChild.val().senderId);
      });

      // Display employees who haven't sent feedback
      employeesSnapshot.forEach(function (employeeChild) {
        var employeeData = employeeChild.val();
        var employeeId = employeeChild.key;
        if (!feedbackSenders.has(employeeId)) {
          var newRow = tableBody.insertRow();
          var cell1 = newRow.insertCell(0);
          var cell2 = newRow.insertCell(1);
          cell1.textContent = employeeData.name;
          var requestButton = document.createElement('button');
          requestButton.textContent = 'Request Feedback';
          requestButton.onclick = function () {
            return requestFeedback(employeeId, db);
          };
          cell2.appendChild(requestButton);
        }
      });
    });
  });
}

// Function to request feedback from an employee
function requestFeedback(employeeId, db) {
  var requestRef = db.ref('requests');
  db.push(requestRef, {
    employeeId: employeeId,
    timestamp: new Date().toISOString()
  });
  alert('Feedback request sent to employee ID: ' + employeeId);
}

// Fetch and display employees on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchAndDisplayEmployees(
    db.onValue,
    db.ref('employees'),
    db.ref('feedback'),
    document
  );
});

module.exports = {
  fetchAndDisplayEmployees,
  requestFeedback,
  firebaseMock  // Exporting the mock for testing purposes
};

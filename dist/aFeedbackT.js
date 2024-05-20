"use strict";

var _firebaseApp = require("https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js");
var _firebaseDatabase = require("https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js");
// Your web app's Firebase configuration
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

// Initialize Firebase
var app = (0, _firebaseApp.initializeApp)(firebaseConfig);
var database = (0, _firebaseDatabase.getDatabase)(app);

// References to your employees and feedback data in the database
var employeesRef = (0, _firebaseDatabase.ref)(database, 'employees');
var feedbackRef = (0, _firebaseDatabase.ref)(database, 'feedback');

// Function to fetch and display employees who haven't sent feedback
function fetchAndDisplayEmployees() {
  // Get table body element
  var tableBody = document.getElementById('feedbackTable').getElementsByTagName('tbody')[0];

  // Fetch employees and feedback data
  (0, _firebaseDatabase.onValue)(employeesRef, function (employeesSnapshot) {
    (0, _firebaseDatabase.onValue)(feedbackRef, function (feedbackSnapshot) {
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
            return requestFeedback(employeeId);
          };
          cell2.appendChild(requestButton);
        }
      });
    });
  });
}

// Function to request feedback from an employee
function requestFeedback(employeeId) {
  var requestRef = (0, _firebaseDatabase.ref)(database, 'requests');
  (0, _firebaseDatabase.push)(requestRef, {
    employeeId: employeeId,
    timestamp: new Date().toISOString()
  });
  alert('Feedback request sent to employee ID: ' + employeeId);
}

// Fetch and display employees on page load
document.addEventListener('DOMContentLoaded', fetchAndDisplayEmployees);

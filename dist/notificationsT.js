"use strict";

var _firebaseApp = require("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
var _firebaseDatabase = require("https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js");
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

// Initialize Firebase
var app = (0, _firebaseApp.initializeApp)(firebaseConfig);
var db = (0, _firebaseDatabase.getDatabase)(app);
function checkMealBooking(name) {
  console.log("Checking meal bookings for:", name);
  var bookingsRef = (0, _firebaseDatabase.ref)(db, 'mealsBooking');
  (0, _firebaseDatabase.onValue)(bookingsRef, function (snapshot) {
    var bookings = snapshot.val();
    var message;
    if (bookings) {
      var userBookings = Object.values(bookings).filter(function (booking) {
        return booking.employee === name;
      });
      if (userBookings.length > 0) {
        // User has meal bookings
        message = "You have meal bookings for the following dates: ";
        userBookings.forEach(function (booking) {
          message += "".concat(booking.date, " (").concat(booking.mealType, "), ");
        });
        message = message.slice(0, -2); // Remove the last comma and space
      } else {
        // User does not have any meal bookings
        message = "Please book your meals.";
      }
    } else {
      // No bookings found
      message = "No bookings found. Please book your meals.";
    }
    displayNotification(message);
  });
}

// Function to check if the user has booked a car wash
function checkCarWashBooking(name) {
  console.log("Checking car wash bookings for:", name);
  var bookingsRef = (0, _firebaseDatabase.ref)(db, 'bookings');
  (0, _firebaseDatabase.onValue)(bookingsRef, function (snapshot) {
    var bookings = snapshot.val();
    var message;
    if (bookings) {
      var userBookings = Object.values(bookings).filter(function (booking) {
        return booking.name === name;
      });
      if (userBookings.length > 0) {
        // User has a car wash booking
        message = "You have a car wash booking for this week.";
      } else {
        // User does not have a car wash booking
        message = "Please book your car wash for the week.";
      }
    } else {
      // No bookings found
      message = "No bookings found. Book a carwash.";
    }
    displayNotification(message);
  });
}

// Function to display notifications
function displayNotification(message) {
  var notificationsSection = document.getElementById('notificationsSection');
  var notificationDiv = document.createElement('div');
  notificationDiv.className = 'notification';
  notificationDiv.textContent = message;
  notificationsSection.appendChild(notificationDiv);
  notificationsSection.style.display = 'block'; // Show the notifications section
}

// Function to handle form submission
document.getElementById('employeeForm').addEventListener('submit', function (e) {
  e.preventDefault();
  var employeeName = document.getElementById('employeeName').value;
  document.getElementById('notificationsSection').innerHTML = ''; // Clear previous notifications
  checkMealBooking(employeeName);
  checkCarWashBooking(employeeName);
});

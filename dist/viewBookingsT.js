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

// Fetch and display car wash bookings

function fetchCarWashBookings() {
  var carWashRef = (0, _firebaseDatabase.ref)(db, 'bookings');
  (0, _firebaseDatabase.onValue)(carWashRef, function (snapshot) {
    var bookings = snapshot.val();
    var tableBody = document.querySelector('#carWashTable tbody');
    tableBody.innerHTML = ''; // Clear existing table rows
    for (var key in bookings) {
      if (bookings.hasOwnProperty(key)) {
        var booking = bookings[key];
        var row = tableBody.insertRow();
        row.innerHTML = "\n                    <td>".concat(booking.name, "</td>\n                    <td>").concat(booking.email, "</td>\n                    <td>").concat(booking.date, "</td>\n                ");
      }
    }
  });
}

// Fetch and display meal bookings
function fetchMealBookings() {
  var mealsRef = (0, _firebaseDatabase.ref)(db, 'mealsBooking');
  (0, _firebaseDatabase.onValue)(mealsRef, function (snapshot) {
    var bookings = snapshot.val();
    var tableBody = document.querySelector('#mealTable tbody');
    tableBody.innerHTML = ''; // Clear existing table rows
    for (var key in bookings) {
      if (bookings.hasOwnProperty(key)) {
        var booking = bookings[key];
        var row = tableBody.insertRow();
        row.innerHTML = "\n                    <td>".concat(booking.employee, "</td>\n                    <td>").concat(booking.date, "</td>\n                    <td>").concat(booking.mealType, "</td>\n                ");
      }
    }
  });
}

// Fetch bookings on page load
document.addEventListener('DOMContentLoaded', function () {
  fetchCarWashBookings();
  fetchMealBookings();
});

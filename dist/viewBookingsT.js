"use strict";

// Mock Firebase methods
const firebaseMock = {
  initializeApp: jest.fn(),
  getDatabase: jest.fn(() => ({
    ref: jest.fn(() => ({
      onValue: jest.fn()
    })),
    onValue: jest.fn()
  }))
};

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
var app = firebaseMock.initializeApp(firebaseConfig);
var db = firebaseMock.getDatabase(app);

// Fetch and display car wash bookings
function fetchCarWashBookings(onValue, db) {
  var carWashRef = db.ref('bookings');
  onValue(carWashRef, function (snapshot) {
    var bookings = snapshot.val();
    var tableBody = document.querySelector('#carWashTable tbody');
    tableBody.innerHTML = ''; // Clear existing table rows
    for (var key in bookings) {
      if (bookings.hasOwnProperty(key)) {
        var booking = bookings[key];
        var row = tableBody.insertRow();
        row.innerHTML = `
                    <td>${booking.name}</td>
                    <td>${booking.email}</td>
                    <td>${booking.date}</td>
                `;
      }
    }
  });
}

// Fetch and display meal bookings
function fetchMealBookings(onValue, db) {
  var mealsRef = db.ref('mealsBooking');
  onValue(mealsRef, function (snapshot) {
    var bookings = snapshot.val();
    var tableBody = document.querySelector('#mealTable tbody');
    tableBody.innerHTML = ''; // Clear existing table rows
    for (var key in bookings) {
      if (bookings.hasOwnProperty(key)) {
        var booking = bookings[key];
        var row = tableBody.insertRow();
        row.innerHTML = `
                    <td>${booking.employee}</td>
                    <td>${booking.date}</td>
                    <td>${booking.mealType}</td>
                `;
      }
    }
  });
}

// Fetch bookings on page load
document.addEventListener('DOMContentLoaded', function () {
  fetchCarWashBookings(db.onValue, db);
  fetchMealBookings(db.onValue, db);
});

module.exports = {
  fetchCarWashBookings,
  fetchMealBookings,
  firebaseMock  // Exporting the mock for testing purposes
};

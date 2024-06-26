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


// Initialize Firebase
var app = firebaseMock.initializeApp();
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

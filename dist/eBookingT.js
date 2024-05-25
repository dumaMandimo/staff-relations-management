"use strict";

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
      orderByChild: jest.fn(() => ({
        equalTo: jest.fn(() => ({
          onValue: jest.fn()
        }))
      }))
    })),
    onValue: jest.fn()
  }))
};

// Initialize Firebase
var app = firebaseMock.initializeApp();
var db = firebaseMock.getDatabase(app);

// Form submission event listener
function setupFormSubmission(submitHandler, document) {
  document.getElementById('bookingForm').addEventListener('submit', submitHandler);
}

function submitHandler(e, checkBookingLimit, push, fetchBookings, document) {
  e.preventDefault();
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var date = document.getElementById('date').value;

  checkBookingLimit(email, date, function (canBook) {
    if (canBook) {
      var bookingsRef = db.ref('bookings');
      push(bookingsRef, {
        name: name,
        email: email,
        date: date
      }).then(function () {
        fetchBookings();
        document.getElementById('bookingForm').reset();
      }).catch(function (error) {
        console.error('Error booking carwash:', error);
        alert('An error occurred, please try again later.');
      });
    } else {
      alert('You can only book the car wash twice a week.');
    }
  });
}

function checkBookingLimit(email, date, callback) {
  var bookingsRef = db.ref('bookings');
  var currentWeekStart = getWeekStartDate(date);
  var currentWeekEnd = getWeekEndDate(date);
  var q = query(bookingsRef, orderByChild('email'), equalTo(email));
  db.onValue(q, function (snapshot) {
    var bookings = snapshot.val();
    var count = 0;
    for (var key in bookings) {
      if (bookings.hasOwnProperty(key)) {
        var bookingDate = bookings[key].date;
        if (bookingDate >= currentWeekStart && bookingDate <= currentWeekEnd) {
          count++;
        }
      }
    }
    callback(count < 2);
  }, {
    onlyOnce: true
  });
}

function getWeekStartDate(dateStr) {
  var date = new Date(dateStr);
  var day = date.getDay();
  var diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(date.setDate(diff)).toISOString().split('T')[0];
}

function getWeekEndDate(dateStr) {
  var date = new Date(dateStr);
  var day = date.getDay();
  var diff = date.getDate() + (7 - day); // Adjust when day is Sunday
  return new Date(date.setDate(diff)).toISOString().split('T')[0];
}

function fetchBookings() {
  var bookingsRef = db.ref('bookings');
  db.onValue(bookingsRef, function (snapshot) {
    var bookings = snapshot.val();
    var tableBody = document.querySelector('#bookingsTable tbody');
    tableBody.innerHTML = '';
    for (var key in bookings) {
      if (bookings.hasOwnProperty(key)) {
        var booking = bookings[key];
        var row = tableBody.insertRow();
        row.innerHTML = "<td>".concat(booking.name, "</td><td>").concat(booking.email, "</td><td>").concat(booking.date, "</td><td><button onclick=\"window.editBooking('").concat(key, "')\">Edit</button><button onclick=\"window.deleteBooking('").concat(key, "')\">Delete</button></td>");
      }
    }
  });
}

// Function to edit a booking
window.editBooking = function (key) {
  var confirmEdit = confirm("Are you sure you want to edit this form?");
  if (confirmEdit) {
    var bookingRef = db.ref("bookings/".concat(key));

    db.onValue(bookingRef, function (snapshot) {
      var bookingData = snapshot.val();

      document.getElementById('name').value = bookingData.name;
      document.getElementById('email').value = bookingData.email;
      document.getElementById('date').value = bookingData.date;

      var form = document.getElementById('bookingForm');
      form.removeEventListener('submit', submitHandler);
      form.addEventListener('submit', function updateHandler(e) {
        e.preventDefault();

        var updatedName = document.getElementById('name').value;
        var updatedEmail = document.getElementById('email').value;
        var updatedDate = document.getElementById('date').value;

        var bookingsRef = db.ref('bookings');
        checkBookingLimit(updatedEmail, updatedDate, function (canBook) {
          if (canBook) {
            db.remove(bookingRef).then(function () {
              db.push(bookingsRef, {
                name: updatedName,
                email: updatedEmail,
                date: updatedDate
              }).then(function () {
                fetchBookings();
                form.reset();

                form.removeEventListener('submit', updateHandler);
                form.addEventListener('submit', submitHandler);
              }).catch(function (error) {
                console.error('Error updating booking:', error);
                alert('An error occurred, please try again later.');
              });
            }).catch(function (error) {
              console.error('Error deleting old booking:', error);
              alert('An error occurred while deleting the old booking.');
            });
          } else {
            alert('You can only book the car wash twice a week.');
          }
        });
      });
    }, {
      onlyOnce: true
    });
  }
};

// Function to delete a booking
window.deleteBooking = function (key) {
  var confirmDelete = confirm('Are you sure you want to delete this booking?');
  if (confirmDelete) {
    var bookingRef = db.ref("bookings/".concat(key));
    db.remove(bookingRef).then(function () {
      fetchBookings();
    }).catch(function (error) {
      console.error('Error deleting booking:', error);
      alert('An error occurred while deleting booking.');
    });
  }
};

// Fetch bookings on page load
fetchBookings();

module.exports = {
  setupFormSubmission,
  submitHandler,
  checkBookingLimit,
  fetchBookings
};

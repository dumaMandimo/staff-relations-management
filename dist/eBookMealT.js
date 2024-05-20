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

// Get reference to meals node
var mealsRef = (0, _firebaseDatabase.ref)(db, 'meals');
var bookingsRef = (0, _firebaseDatabase.ref)(db, 'mealsBooking');

// DOM elements
var mealsList = document.getElementById('mealsList');
var bookedMealsTable = document.getElementById('bookedMealsTable');
var dateBooked = document.getElementById('dateBooked');
var cancelMealBtn = document.getElementById('cancelMealBtn');

// Listen for changes in meals data
(0, _firebaseDatabase.onValue)(mealsRef, function (snapshot) {
  var meals = snapshot.val();
  if (meals) {
    // Clear existing meals
    mealsList.innerHTML = '';

    // Display each meal as an option
    Object.keys(meals).forEach(function (key) {
      var meal = meals[key];
      var option = document.createElement('div');
      option.classList.add('meal-option');
      option.innerHTML = "\n                <p><strong>".concat(meal.mealType, "</strong></p>\n                <p>Protein: ").concat(meal.protein, "</p>\n                <p>Starch: ").concat(meal.starch, "</p>\n                <p>Fruit: ").concat(meal.fruit, "</p>\n                <p>Drink: ").concat(meal.drink, "</p>\n                <p>Snack: ").concat(meal.snack, "</p>\n                <label for=\"bookingDate_").concat(key, "\">Booking Date:</label>\n                <input type=\"date\" id=\"bookingDate_").concat(key, "\" required />\n                <button onclick=\"bookMeal('").concat(key, "')\">Book Meal</button>\n            ");
      mealsList.appendChild(option);
    });
  }
});

// Function to book a meal
window.bookMeal = function (mealKey) {
  var employeeName = prompt('Please enter your name:');
  if (employeeName) {
    var bookingDateElement = document.getElementById("bookingDate_".concat(mealKey));
    if (bookingDateElement && bookingDateElement.value) {
      var bookingDate = bookingDateElement.value;
      var mealRef = (0, _firebaseDatabase.ref)(db, "meals/".concat(mealKey));

      // Retrieve meal details to get the meal type
      (0, _firebaseDatabase.onValue)(mealRef, function (snapshot) {
        var mealData = snapshot.val();
        if (mealData) {
          var mealType = mealData.mealType;
          var newBookingRef = (0, _firebaseDatabase.push)(bookingsRef);
          (0, _firebaseDatabase.set)(newBookingRef, {
            employee: employeeName,
            date: bookingDate,
            mealKey: mealKey,
            mealType: mealType // Include meal type in booking
          }).then(function () {
            dateBooked.textContent = "Meal booked on ".concat(bookingDate, " by ").concat(employeeName, ".");
            cancelMealBtn.style.display = 'block';
            cancelMealBtn.setAttribute('data-booking-ref', newBookingRef.key);
            fetchMealBookings(); // Refresh bookings table
          })["catch"](function (error) {
            console.error('Error booking meal:', error);
            alert('An error occurred while booking the meal. Please try again later.');
          });
        }
      });
    } else {
      alert('Please select a booking date.');
    }
  }
};

// Function to cancel meal
cancelMealBtn.addEventListener('click', function () {
  var confirmCancel = confirm('Are you sure you want to cancel your meal?');
  if (confirmCancel) {
    var bookingRefKey = cancelMealBtn.getAttribute('data-booking-ref');
    var bookingRef = (0, _firebaseDatabase.ref)(db, "mealsBooking/".concat(bookingRefKey));
    (0, _firebaseDatabase.remove)(bookingRef).then(function () {
      dateBooked.textContent = 'No meal booked yet.';
      cancelMealBtn.style.display = 'none';
      fetchMealBookings(); // Refresh bookings table
    })["catch"](function (error) {
      console.error('Error cancelling meal:', error);
      alert('An error occurred while cancelling the meal. Please try again later.');
    });
  }
});

// Function to fetch existing bookings
function fetchMealBookings() {
  (0, _firebaseDatabase.onValue)(bookingsRef, function (snapshot) {
    var bookings = snapshot.val();
    if (bookings) {
      // Clear existing bookings display
      var tbody = bookedMealsTable.querySelector('tbody');
      tbody.innerHTML = '';

      // Display each booking
      Object.keys(bookings).forEach(function (key) {
        var booking = bookings[key];
        var row = document.createElement('tr');
        row.innerHTML = "\n                    <td>".concat(booking.employee, "</td>\n                    <td>").concat(booking.date, "</td>\n                    <td>").concat(booking.mealType, "</td>\n                    <td><button onclick=\"deleteBooking('").concat(key, "')\">Delete</button></td>\n                ");
        tbody.appendChild(row);
      });
    }
  });
}

// Function to delete a booking
window.deleteBooking = function (bookingKey) {
  var bookingRef = (0, _firebaseDatabase.ref)(db, "mealsBooking/".concat(bookingKey));
  (0, _firebaseDatabase.remove)(bookingRef).then(function () {
    fetchMealBookings(); // Refresh bookings table
  })["catch"](function (error) {
    console.error('Error deleting booking:', error);
    alert('An error occurred while deleting the booking. Please try again later.');
  });
};

// Fetch existing bookings on page load
fetchMealBookings();

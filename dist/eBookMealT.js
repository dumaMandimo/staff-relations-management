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

// Mock Firebase methods for testing
const firebaseMock = {
  initializeApp: jest.fn(() => ({})),
  getDatabase: jest.fn(() => ({
    ref: jest.fn(() => ({
      onValue: jest.fn(),
      set: jest.fn(),
      push: jest.fn(() => ({ key: 'mocked-key' })),
      remove: jest.fn()
    })),
    onValue: jest.fn(),
    set: jest.fn(),
    push: jest.fn(() => ({ key: 'mocked-key' })),
    remove: jest.fn()
  }))
};

var cancelMealBtn = document.getElementById('cancelMealBtn');

// Initialize Firebase using mocked methods
var app = firebaseMock.initializeApp(firebaseConfig);
var db = firebaseMock.getDatabase(app);

// DOM elements
var mealsList = document.getElementById('mealsList');
var bookedMealsTable = document.getElementById('bookedMealsTable');
var dateBooked = document.getElementById('dateBooked');


// Get reference to meals and bookings nodes
var mealsRef = db.ref('meals');
var bookingsRef = db.ref('mealsBooking');

// Listen for changes in meals data
db.onValue(mealsRef, function (snapshot) {
  var meals = snapshot.val();
  if (meals) {
    // Clear existing meals
    mealsList.innerHTML = '';

    // Display each meal as an option
    Object.keys(meals).forEach(function (key) {
      var meal = meals[key];
      var option = document.createElement('div');
      option.classList.add('meal-option');
      option.innerHTML = `
        <p><strong>${meal.mealType}</strong></p>
        <p>Protein: ${meal.protein}</p>
        <p>Starch: ${meal.starch}</p>
        <p>Fruit: ${meal.fruit}</p>
        <p>Drink: ${meal.drink}</p>
        <p>Snack: ${meal.snack}</p>
        <label for="bookingDate_${key}">Booking Date:</label>
        <input type="date" id="bookingDate_${key}" required />
        <button onclick="window.bookMeal('${key}')">Book Meal</button>
      `;
      mealsList.appendChild(option);
    });
  }
});

// Function to book a meal
window.bookMeal = function (mealKey) {
  var employeeName = prompt('Please enter your name:');
  if (employeeName) {
    var bookingDateElement = document.getElementById(`bookingDate_${mealKey}`);
    if (bookingDateElement && bookingDateElement.value) {
      var bookingDate = bookingDateElement.value;
      var mealRef = db.ref(`meals/${mealKey}`);

      // Retrieve meal details to get the meal type
      db.onValue(mealRef, function (snapshot) {
        var mealData = snapshot.val();
        if (mealData) {
          var mealType = mealData.mealType;
          var newBookingRef = db.push(bookingsRef);
          db.set(newBookingRef, {
            employee: employeeName,
            date: bookingDate,
            mealKey: mealKey,
            mealType: mealType // Include meal type in booking
          }).then(function () {
            dateBooked.textContent = `Meal booked on ${bookingDate} by ${employeeName}.`;
            cancelMealBtn.style.display = 'block';
            cancelMealBtn.setAttribute('data-booking-ref', newBookingRef.key);
            fetchMealBookings(); // Refresh bookings table
          }).catch(function (error) {
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

// Function to setup event listeners
function setupEventListeners() {
  // Function to cancel meal
  cancelMealBtn.addEventListener('click', function () {
    var confirmCancel = confirm('Are you sure you want to cancel your meal?');
    if (confirmCancel) {
      var bookingRefKey = cancelMealBtn.getAttribute('data-booking-ref');
      var bookingRef = db.ref(`mealsBooking/${bookingRefKey}`);
      db.remove(bookingRef).then(function () {
        dateBooked.textContent = 'No meal booked yet.';
        cancelMealBtn.style.display = 'none';
        fetchMealBookings(); // Refresh bookings table
      }).catch(function (error) {
        console.error('Error cancelling meal:', error);
        alert('An error occurred while cancelling the meal. Please try again later.');
      });
    }
  });
}

// Event listener setup
document.addEventListener('DOMContentLoaded', setupEventListeners);

// Function to fetch existing bookings
function fetchMealBookings() {
  db.onValue(bookingsRef, function (snapshot) {
    var bookings = snapshot.val();
    if (bookings) {
      // Clear existing bookings display
      var tbody = bookedMealsTable.querySelector('tbody');
      tbody.innerHTML = '';

      // Display each booking
      Object.keys(bookings).forEach(function (key) {
        var booking = bookings[key];
        var row = document.createElement('tr');
        row.innerHTML = `
          <td>${booking.employee}</td>
          <td>${booking.date}</td>
          <td>${booking.mealType}</td>
          <td><button onclick="window.deleteBooking('${key}')">Delete</button></td>
        `;
        tbody.appendChild(row);
      });
    }
  });
}

// Function to delete a booking
window.deleteBooking = function (bookingKey) {
  var bookingRef = db.ref(`mealsBooking/${bookingKey}`);
  db.remove(bookingRef).then(function () {
    fetchMealBookings(); // Refresh bookings table
  }).catch(function (error) {
    console.error('Error deleting booking:', error);
    alert('An error occurred while deleting the booking. Please try again later.');
  });
};

// Fetch existing bookings on page load
fetchMealBookings();

module.exports = {
  firebaseMock, // Exporting the mock for testing purposes
  bookMeal: window.bookMeal,
  cancelMeal: window.cancelMeal,
  deleteBooking: window.deleteBooking,
  fetchMealBookings
};
"use strict";

// Firebase configuration

// DOM elements
let mealsList;
let bookedMealsTable;
let dateBooked;
let cancelMealBtn;

// Function to initialize Firebase using mocked methods
function initializeFirebase(firebaseMock) {
  const app = firebaseMock.initializeApp();
  const db = firebaseMock.getDatabase(app);
  return db;
}

// Function to setup event listeners
function setupEventListeners(cancelMeal) {
  // Function to cancel meal
  cancelMealBtn.addEventListener("click", () => {
    cancelMeal();
  });
}

// Function to fetch existing bookings
function fetchMealBookings(db, bookingsRef) {
  db.onValue(bookingsRef, (snapshot) => {
    const bookings = snapshot.val();
    if (bookings) {
      // Clear existing bookings display
      const tbody = bookedMealsTable.querySelector("tbody");
      tbody.innerHTML = "";

      // Display each booking
      Object.keys(bookings).forEach((key) => {
        const booking = bookings[key];
        const row = document.createElement("tr");
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

module.exports = {
  initializeFirebase,
  setupEventListeners,
  fetchMealBookings,
};

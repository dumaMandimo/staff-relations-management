'use strict';
const firebaseMock = {
  initializeApp: jest.fn(),
  getDatabase: jest.fn(() => ({
    ref: jest.fn((path) => ({
      onValue: jest.fn()
    }))
  }))
};

// Initialize Firebase
var app = firebaseMock.initializeApp();
var db = firebaseMock.getDatabase(app);

function checkMealBooking(name, displayNotification) {
  console.log("Checking meal bookings for:", name);
  const bookingsRef = db.ref('mealsBooking');
  bookingsRef.onValue = jest.fn((callback) => callback({ val: () => ({
    booking1: { employee: 'John Doe', date: '2023-05-21', mealType: 'Lunch' },
    booking2: { employee: 'John Doe', date: '2023-05-22', mealType: 'Dinner' },
  })}));
  bookingsRef.onValue((snapshot) => {
    const bookings = snapshot.val();
    let message;
    if (bookings) {
      const userBookings = Object.values(bookings).filter(booking => booking.employee === name);
      if (userBookings.length > 0) {
        message = `You have meal bookings for the following dates: `;
        userBookings.forEach(booking => {
          message += `${booking.date} (${booking.mealType}), `;
        });
        message = message.slice(0, -2); // Remove the last comma and space
      } else {
        message = `Please book your meals.`;
      }
    } else {
      message = `No bookings found. Please book your meals.`;
    }
    displayNotification(message);
  });
}

function checkCarWashBooking(name, displayNotification) {
  console.log("Checking car wash bookings for:", name);
  const bookingsRef = db.ref('bookings');
  bookingsRef.onValue = jest.fn((callback) => callback({ val: () => ({
    booking1: { name: 'John Doe', date: '2023-05-21' },
    booking2: { name: 'Jane Smith', date: '2023-05-22' },
  })}));
  bookingsRef.onValue((snapshot) => {
    const bookings = snapshot.val();
    let message;
    if (bookings) {
      const userBookings = Object.values(bookings).filter(booking => booking.name === name);
      if (userBookings.length > 0) {
        message = `You have a car wash booking for this week.`;
      } else {
        message = `Please book your car wash for the week.`;
      }
    } else {
      message = `No bookings found. Book a carwash.`;
    }
    displayNotification(message);
  });
}

module.exports = { checkMealBooking, checkCarWashBooking, firebaseMock };

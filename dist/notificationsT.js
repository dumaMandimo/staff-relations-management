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
var app = firebaseMock.initializeApp(firebaseConfig);
var db = firebaseMock.getDatabase(app);

function checkMealBooking(name) {
  console.log("Checking meal bookings for:", name);
  const bookingsRef = db.ref('mealsBooking');
  const onValueMock = jest.fn((callback) => callback({ val: () => bookings }));
  firebaseMock.getDatabase().ref().onValue.mockImplementationOnce(onValueMock);
}

function checkCarWashBooking(name) {
  console.log("Checking car wash bookings for:", name);
  const bookingsRef = db.ref('bookings');
  const onValueMock = jest.fn((callback) => callback({ val: () => bookings }));
  firebaseMock.getDatabase().ref().onValue.mockImplementationOnce(onValueMock);
}

module.exports = { checkMealBooking, checkCarWashBooking, firebaseMock };
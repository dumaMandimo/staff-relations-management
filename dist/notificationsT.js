'use strict';
const firebaseMock = {
  initializeApp: jest.fn(),
  getDatabase: jest.fn(() => ({
    ref: jest.fn((path) => ({
      onValue: jest.fn()
    }))
  }))
};
// Firebase configuration
const firebaseConfig = {
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
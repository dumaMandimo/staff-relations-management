// Import the functions to be tested
const { fetchCarWashBookings, fetchMealBookings } = require('../dist/viewBookingsT');

describe('Client-Side Functionality Tests', () => {
  let mockDatabase;

  beforeEach(() => {
    // Mock Firebase database methods
    mockDatabase = {
      ref: jest.fn(() => mockDatabase),
      onValue: jest.fn((ref, callback) => {
        // Simulate snapshot data
        const snapshot = {
          val: () => ({
            booking1: { name: 'John', email: 'john@example.com', date: '2024-05-20' },
            booking2: { name: 'Alice', email: 'alice@example.com', date: '2024-05-21' }
          })
        };
        // Call the callback function with the snapshot
        callback(snapshot);
      })
    };

    // Mock DOM elements
    document.querySelector = jest.fn(() => ({
      innerHTML: '', // Mocking innerHTML
      insertRow: jest.fn(() => ({
        innerHTML: '', // Mocking innerHTML for inserted rows
      })),
    }));
  });

  describe('Firebase Initialization', () => {
    it('should initialize Firebase with the provided configuration', () => {
      // Call the function to be tested
      // This test assumes Firebase initialization is done in the tested script itself
      // You may need to adjust the test based on the actual initialization mechanism
      // For instance, if Firebase initialization is done asynchronously, you may need to use async/await or return promises
      expect(mockDatabase.ref).toHaveBeenCalledWith('bookings');
      expect(mockDatabase.ref).toHaveBeenCalledWith('mealsBooking');
      // Add more assertions to ensure correct initialization
    });
  });

  describe('fetchCarWashBookings', () => {
    it('should fetch and display car wash bookings', () => {
      // Call the function to be tested
      fetchCarWashBookings(mockDatabase);

      // Assertions
      expect(mockDatabase.ref).toHaveBeenCalledWith('bookings');
      expect(mockDatabase.onValue).toHaveBeenCalled();
      // You can add more assertions to test the displayed table rows
    });

    // More test cases can be added to cover other scenarios
  });

  describe('fetchMealBookings', () => {
    it('should fetch and display meal bookings', () => {
      // Call the function to be tested
      fetchMealBookings(mockDatabase);

      // Assertions
      expect(mockDatabase.ref).toHaveBeenCalledWith('mealsBooking');
      expect(mockDatabase.onValue).toHaveBeenCalled();
      // You can add more assertions to test the displayed table rows
    });

    // More test cases can be added to cover other scenarios
  });

  describe('Page Load Event Listener', () => {
    it('should fetch bookings on page load', () => {
      // Call the event listener directly to simulate page load
      document.dispatchEvent(new Event('DOMContentLoaded'));

      // Assertions
      expect(mockDatabase.ref).toHaveBeenCalledWith('bookings');
      expect(mockDatabase.ref).toHaveBeenCalledWith('mealsBooking');
      expect(mockDatabase.onValue).toHaveBeenCalledTimes(2);
      // Add more assertions if needed
    });
  });
});

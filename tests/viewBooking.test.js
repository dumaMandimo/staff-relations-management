// Import necessary functions and modules
const { fetchCarWashBookings, fetchMealBookings, firebaseMock } = require('../dist/viewBookingsT'); // Replace 'yourScript' with the actual name of your script file

describe('fetchCarWashBookings', () => {
  test('should fetch and display car wash bookings', () => {
    // Mock snapshot data
    const snapshot = {
      val: () => ({
        booking1: { name: 'John', email: 'john@example.com', date: '2024-05-20' },
        booking2: { name: 'Alice', email: 'alice@example.com', date: '2024-05-21' }
      })
    };

    // Mock Firebase reference
    const mockRef = jest.fn(() => ({
      onValue: jest.fn(callback => callback(snapshot))
    }));

    // Mock database
    const mockDatabase = {
      ref: jest.fn(() => mockRef)
    };

    // Mock DOM elements
    document.querySelector = jest.fn(() => ({
      innerHTML: '', // Mocking innerHTML
      insertRow: jest.fn(() => ({
        innerHTML: '', // Mocking innerHTML for inserted rows
      })),
    }));

    // Call the function to be tested
    fetchCarWashBookings(mockDatabase.ref, mockDatabase);

    // Assertions
    expect(mockDatabase.ref).toHaveBeenCalledWith('bookings');
    expect(mockRef.onValue).toHaveBeenCalled();
    // You can add more assertions to test the displayed table rows
  });
});

describe('fetchMealBookings', () => {
  test('should fetch and display meal bookings', () => {
    // Mock snapshot data
    const snapshot = {
      val: () => ({
        booking1: { employee: 'John', date: '2024-05-20', mealType: 'Breakfast' },
        booking2: { employee: 'Alice', date: '2024-05-21', mealType: 'Lunch' }
      })
    };

    // Mock Firebase reference
    const mockRef = jest.fn(() => ({
      onValue: jest.fn(callback => callback(snapshot))
    }));

    // Mock database
    const mockDatabase = {
      ref: jest.fn(() => mockRef)
    };

    // Mock DOM elements
    document.querySelector = jest.fn(() => ({
      innerHTML: '', // Mocking innerHTML
      insertRow: jest.fn(() => ({
        innerHTML: '', // Mocking innerHTML for inserted rows
      })),
    }));

    // Call the function to be tested
    fetchMealBookings(mockDatabase.ref, mockDatabase);

    // Assertions
    expect(mockDatabase.ref).toHaveBeenCalledWith('mealsBooking');
    expect(mockRef.onValue).toHaveBeenCalled();
    // You can add more assertions to test the displayed table rows
  });
});

describe('Page Load Event Listener', () => {
  test('should fetch bookings on page load', () => {
    // Mock DOM elements
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Assertions
    expect(firebaseMock.getDatabase).toHaveBeenCalled();
    expect(firebaseMock.initializeApp).toHaveBeenCalledWith({
      // Mock Firebase configuration
      apiKey: expect.any(String),
      authDomain: expect.any(String),
      databaseURL: expect.any(String),
      projectId: expect.any(String),
      storageBucket: expect.any(String),
      messagingSenderId: expect.any(String),
      appId: expect.any(String),
      measurementId: expect.any(String)
    });
    // You can add more assertions if needed
  });
});

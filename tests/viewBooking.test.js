// Import the functions to be tested
const { fetchCarWashBookings, fetchMealBookings, firebaseMock } = require('../dist/viewBookingsT');

// Mock document object
const mockDocument = {
  querySelector: jest.fn(() => ({
    innerHTML: '',
    insertRow: jest.fn()
  })),
  addEventListener: jest.fn((event, callback) => {
    if (event === 'DOMContentLoaded') callback();
  })
};

describe('Fetch car wash bookings function', () => {
  test('Fetches and displays car wash bookings correctly', () => {
    // Mock data
    const snapshotMock = {
      val: jest.fn(() => ({
        booking1: { name: 'John Doe', email: 'john@example.com', date: '2024-05-26' },
        booking2: { name: 'Jane Doe', email: 'jane@example.com', date: '2024-05-27' }
      }))
    };
    const onValueMock = jest.fn((ref, callback) => callback(snapshotMock));

    // Call the function
    fetchCarWashBookings(onValueMock, firebaseMock.getDatabase());

    // Check assertions
    expect(onValueMock).toHaveBeenCalledWith(expect.any(Function), firebaseMock.getDatabase().ref('bookings'));
    expect(mockDocument.querySelector).toHaveBeenCalledWith('#carWashTable tbody');
    expect(snapshotMock.val).toHaveBeenCalled();
    expect(mockDocument.querySelector().insertRow).toHaveBeenCalledTimes(2);
  });
});

describe('Fetch meal bookings function', () => {
  test('Fetches and displays meal bookings correctly', () => {
    // Mock data
    const snapshotMock = {
      val: jest.fn(() => ({
        booking1: { employee: 'John Doe', date: '2024-05-26', mealType: 'Lunch' },
        booking2: { employee: 'Jane Doe', date: '2024-05-27', mealType: 'Dinner' }
      }))
    };
    const onValueMock = jest.fn((ref, callback) => callback(snapshotMock));

    // Call the function
    fetchMealBookings(onValueMock, firebaseMock.getDatabase());

    // Check assertions
    expect(onValueMock).toHaveBeenCalledWith(expect.any(Function), firebaseMock.getDatabase().ref('mealsBooking'));
    expect(mockDocument.querySelector).toHaveBeenCalledWith('#mealTable tbody');
    expect(snapshotMock.val).toHaveBeenCalled();
    expect(mockDocument.querySelector().insertRow).toHaveBeenCalledTimes(2);
  });
});

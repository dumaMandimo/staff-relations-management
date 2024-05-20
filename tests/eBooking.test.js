// Import the functions you want to test
const { setupFormSubmission, fetchBookings, checkBookingLimit } = require('../dist/eBookingT');

describe('fetchBookings', () => {
  it('should fetch bookings', () => {
    // Mock necessary DOM elements
    const mockDocument = {
      querySelector: jest.fn(() => ({ innerHTML: '' }))
    };

    // Call the function to be tested
    fetchBookings(mockDocument);

    // Assertions
    expect(mockDocument.querySelector).toHaveBeenCalledWith('#bookingsTable tbody');
  });
});

describe('setupFormSubmission', () => {
  it('should set up form submission event listener', () => {
    // Mock necessary DOM elements
    const mockSubmitHandler = jest.fn();
    const mockFormElement = {
      addEventListener: jest.fn()
    };
    const mockDocument = {
      getElementById: jest.fn(() => mockFormElement)
    };

    // Call the function to be tested
    setupFormSubmission(mockSubmitHandler, mockDocument);

    // Assertions
    expect(mockDocument.getElementById).toHaveBeenCalledWith('bookingForm');
    expect(mockFormElement.addEventListener).toHaveBeenCalledWith('submit', expect.any(Function));
  });
});

describe('checkBookingLimit', () => {
  it('should allow booking if user has booked less than twice in the current week', () => {
    const mockCallback = jest.fn();

    // Mock Firebase methods
    const mockDatabase = {
      ref: jest.fn(() => ({
        onValue: jest.fn((callback) => {
          // Simulate data for the current week
          const bookings = {
            booking1: { email: 'test@example.com', date: '2024-05-16' },
            booking2: { email: 'test@example.com', date: '2024-05-18' }
          };
          // Call the callback with the snapshot data
          callback({ val: () => bookings });
        })
      }))
    };

    // Call the function to be tested
    checkBookingLimit('test@example.com', '2024-05-20', mockCallback);

    // Assertions
    expect(mockDatabase.ref).toHaveBeenCalledWith('bookings');
    expect(mockCallback).toHaveBeenCalledWith(true); // Should allow booking
  });
});

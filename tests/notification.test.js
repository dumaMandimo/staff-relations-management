const { checkMealBooking, checkCarWashBooking, firebaseMock, firebaseConfig } = require('../dist/notificationsT');

// Mocking displayNotification function
const displayNotification = jest.fn();

describe('checkMealBooking', () => {
  beforeEach(() => {
    // Mock console.log function
    console.log = jest.fn();
    // Reset the mock calls for displayNotification before each test
    displayNotification.mockClear();
  });

  test('should display notification for meal bookings', () => {
    // Mock the bookings data
    const bookings = {
      booking1: { employee: 'John Doe', date: '2023-05-21', mealType: 'Lunch' },
      booking2: { employee: 'John Doe', date: '2023-05-22', mealType: 'Dinner' },
      booking3: { employee: 'Jane Smith', date: '2023-05-21', mealType: 'Lunch' },
    };

    // Mock the onValue callback
    const onValueMock = jest.fn();
    firebaseMock.getDatabase().ref().onValue = onValueMock.mockImplementationOnce(callback => {
      callback({ val: () => bookings });
    });

    // Call the function to be tested
    checkMealBooking('John Doe');

    // Assertions
    expect(console.log).toHaveBeenCalledWith('Checking meal bookings for:', 'John Doe');
    expect(displayNotification).toHaveBeenCalledWith(
      'You have meal bookings for the following dates: 2023-05-21 (Lunch), 2023-05-22 (Dinner)'
    );
  });

  test('should display notification for no meal bookings', () => {
    // Mock the onValue callback with no bookings
    const onValueMock = jest.fn();
    firebaseMock.getDatabase().ref().onValue = onValueMock.mockImplementationOnce(callback => {
      callback({ val: () => null });
    });

    // Call the function to be tested
    checkMealBooking('John Doe');

    // Assertions
    expect(console.log).toHaveBeenCalledWith('Checking meal bookings for:', 'John Doe');
    expect(displayNotification).toHaveBeenCalledWith('No bookings found. Please book your meals.');
  });
});

describe('checkCarWashBooking', () => {
  beforeEach(() => {
    // Mock console.log function
    console.log = jest.fn();
    // Reset the mock calls for displayNotification before each test
    displayNotification.mockClear();
  });

  test('should display notification for car wash booking', () => {
    // Mock the bookings data
    const bookings = {
      booking1: { name: 'John Doe', date: '2023-05-21' },
    };

    // Mock the onValue callback
    const onValueMock = jest.fn();
    firebaseMock.getDatabase().ref().onValue = onValueMock.mockImplementationOnce(callback => {
      callback({ val: () => bookings });
    });

    // Call the function to be tested
    checkCarWashBooking('John Doe');

    // Assertions
    expect(console.log).toHaveBeenCalledWith('Checking car wash bookings for:', 'John Doe');
    expect(displayNotification).toHaveBeenCalledWith('You have a car wash booking for this week.');
  });

  test('should display notification for no car wash bookings', () => {
    // Mock the onValue callback with no bookings
    const onValueMock = jest.fn();
    firebaseMock.getDatabase().ref().onValue = onValueMock.mockImplementationOnce(callback => {
      callback({ val: () => null });
    });

    // Call the function to be tested
    checkCarWashBooking('John Doe');

    // Assertions
    expect(console.log).toHaveBeenCalledWith('Checking car wash bookings for:', 'John Doe');
    expect(displayNotification).toHaveBeenCalledWith('No bookings found. Book a carwash.');
  });
});

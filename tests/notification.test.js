'use strict';
const { checkMealBooking, checkCarWashBooking, firebaseMock } = require('../dist/notificationsT');

describe('checkMealBooking', () => {
  test('should display notification for meal bookings', () => {
    const displayNotificationMock = jest.fn();
    checkMealBooking('John Doe', displayNotificationMock);

    // Assertions
    expect(displayNotificationMock).toHaveBeenCalledWith(
      'You have meal bookings for the following dates: 2023-05-21 (Lunch), 2023-05-22 (Dinner)'
    );
  });

  test('should display notification for no meal bookings', () => {
    const displayNotificationMock = jest.fn();
    checkMealBooking('Jane Doe', displayNotificationMock);

    // Assertions
    expect(displayNotificationMock).toHaveBeenCalledWith('Please book your meals.');
  });
});

describe('checkCarWashBooking', () => {
  test('should display notification for car wash booking', () => {
    const displayNotificationMock = jest.fn();
    checkCarWashBooking('John Doe', displayNotificationMock);

    // Assertions
    expect(displayNotificationMock).toHaveBeenCalledWith(
      'You have a car wash booking for this week.'
    );
  });

  test('should display notification for no car wash bookings', () => {
    const displayNotificationMock = jest.fn();
    checkCarWashBooking('Jane Doe', displayNotificationMock);

    // Assertions
    expect(displayNotificationMock).toHaveBeenCalledWith('Please book your car wash for the week.');
  });
});

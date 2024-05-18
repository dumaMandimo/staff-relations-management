// Import the module under test (submitHandler function)
const { submitHandler } = require('../views/employee/eBooking');

// Mock the Firebase modules
jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(() => ({ // Mock initializeApp to return the initialized Firebase app
        database: jest.fn(() => ({
            ref: jest.fn(),
            // Mock other database functions if necessary
        })),
    })),
}));

jest.mock('firebase/database', () => ({
    getDatabase: jest.fn(),
    ref: jest.fn(),
    push: jest.fn(),
    onValue: jest.fn(),
    remove: jest.fn(),
    query: jest.fn(),
    orderByChild: jest.fn(),
    equalTo: jest.fn(),
}));

describe('submitHandler', () => {
    test('should submit booking form', () => {
        // Mock event object
        const e = {
            preventDefault: jest.fn(),
            target: {
                elements: {
                    name: { value: 'John Doe' },
                    email: { value: 'john@example.com' },
                    date: { value: '2024-05-20' },
                },
                reset: jest.fn(),
            },
        };

        // Mock checkBookingLimit function
        const mockCheckBookingLimit = jest.fn(callback => callback(true));

        // Mock fetchBookings function
        const mockFetchBookings = jest.fn();

        // Call submitHandler with mocked parameters
        submitHandler(e, mockCheckBookingLimit, mockFetchBookings);

        // Expectations
        expect(e.preventDefault).toHaveBeenCalled();
        expect(mockCheckBookingLimit).toHaveBeenCalled();
        expect(mockFetchBookings).toHaveBeenCalled();
        expect(e.target.reset).toHaveBeenCalled();
    });
});

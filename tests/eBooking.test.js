// Import the functions to test
const {
  setupFormSubmission,
  submitHandler,
  checkBookingLimit,
  fetchBookings,
} = require('../dist/eBookingT'); 

// Mock document and Firebase dependencies
const mockAddEventListener = jest.fn();
document.getElementById = jest.fn().mockReturnValue({
  addEventListener: mockAddEventListener,
  reset: jest.fn()
});
document.querySelector = jest.fn().mockReturnValue({
  innerHTML: '',
  insertRow: jest.fn(() => ({
    innerHTML: ''
  }))
});

const mockPush = jest.fn(() => Promise.resolve());
const mockRemove = jest.fn(() => Promise.resolve());
const mockOnValue = jest.fn((query, callback) => {
  callback({
    val: () => ({ testKey: { date: '2024-05-21' } })
  });
});

const mockRef = jest.fn((path) => {
  if (path === 'bookings') {
    return {
      orderByChild: jest.fn().mockReturnThis(),
      equalTo: jest.fn().mockReturnThis(),
      onValue: mockOnValue,
      push: mockPush,
      remove: mockRemove
    };
  }
});


const mockDatabase = {
  ref: mockRef,
  onValue: mockOnValue,
  push: mockPush,
  remove: mockRemove
};
const mockFirebase = {
  initializeApp: jest.fn(),
  getDatabase: jest.fn(() => mockDatabase)
};
global.firebaseMock = mockFirebase;

// Mock the Firebase query functions
global.query = jest.fn();
global.orderByChild = jest.fn();
global.equalTo = jest.fn();

describe('Firebase Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('setupFormSubmission adds submit event listener', () => {
    setupFormSubmission(submitHandler, document);
    expect(document.getElementById).toHaveBeenCalledWith('bookingForm');
    expect(mockAddEventListener).toHaveBeenCalled();
  });

  test('submitHandler prevents default submission and calls checkBookingLimit', () => {
    const e = { preventDefault: jest.fn() };
    const checkBookingLimitMock = jest.fn();
    submitHandler(e, checkBookingLimitMock, jest.fn(), jest.fn(), document);
    expect(e.preventDefault).toHaveBeenCalled();
    expect(checkBookingLimitMock).toHaveBeenCalled();
  });

  test('checkBookingLimit checks booking limit and invokes callback', () => {
    const callbackMock = jest.fn();
    checkBookingLimit('test@test.com', '2024-05-21', callbackMock);
    expect(mockRef).toHaveBeenCalledWith('bookings');
    expect(mockOnValue).toHaveBeenCalled();
    // Simulate callback invocation
    mockOnValue.mock.calls[0][1]({ val: () => ({ testKey: { date: '2024-05-21' } }) });
    expect(callbackMock).toHaveBeenCalled();
  });

  test('fetchBookings fetches bookings and updates table', () => {
    fetchBookings();
    expect(mockRef).toHaveBeenCalledWith('bookings');
    expect(mockOnValue).toHaveBeenCalled();
    // Simulate snapshot data
    const snapshotData = { testKey: { name: 'Test Name', email: 'test@test.com', date: '2024-05-21' } };
    mockOnValue.mock.calls[0][1]({ val: () => snapshotData });
    expect(document.querySelector).toHaveBeenCalledWith('#bookingsTable tbody');
    expect(document.querySelector().innerHTML).not.toEqual('');
  });

  // Add more tests for editBooking and deleteBooking functions if needed
});
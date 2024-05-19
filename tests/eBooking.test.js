import { submitHandler } from '../views/employee/eBooking';

// Mock Firebase dependencies
const mockFirebase = {
  ref: jest.fn(),
  push: jest.fn(),
  db: {},
  query: jest.fn(),
  onValue: jest.fn(),
  orderByChild: jest.fn(),
  equalTo: jest.fn(),
};

// Mock the document
const mockDocument = {
  getElementById: jest.fn(() => ({
    value: 'John',
  })),
  addEventListener: jest.fn((event, callback) => {
    if (event === 'submit') {
      callback({ preventDefault: jest.fn() });
    }
  }),
};

// Set up a simple mock for the window object
global.document = mockDocument;
global.window = {
  confirm: jest.fn(() => true),
};

describe('submitHandler function', () => {
  test('should handle form submission correctly', () => {
    submitHandler({ preventDefault: jest.fn() }, mockFirebase);

    expect(mockFirebase.push).toHaveBeenCalled();
    expect(mockFirebase.ref).toHaveBeenCalled();
    // Add more assertions as needed
  });
});

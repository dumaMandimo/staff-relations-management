const {
  addMeal,
  editMeal,
  deleteMeal,
  fetchMeals,
  firebaseMock
} = require('../dist/createMealT');

describe('addMeal', () => {
  test('adds a meal to the database', () => {
    const mockDb = firebaseMock.getDatabase(firebaseMock.initializeApp());
    const mockDocument = { getElementById: jest.fn().mockReturnValue({ value: 'test', reset: jest.fn() }) };
    const mockFetchMeals = jest.fn();

    addMeal({ preventDefault: jest.fn() }, mockDb, mockDocument, mockFetchMeals);

    // Adjusted expectation for push method call
    expect(mockDb.ref().push).toHaveBeenCalled(); 

    expect(mockFetchMeals).toHaveBeenCalled();
    expect(mockDocument.getElementById).toHaveBeenCalledTimes(7);
    expect(mockDocument.getElementById('mealForm').reset).toHaveBeenCalled();
  });
});

describe('editMeal', () => {
  test('edits a meal in the database', () => {
    const mockDb = firebaseMock.getDatabase(firebaseMock.initializeApp());
    const mockDocument = { getElementById: jest.fn().mockReturnValue({ value: 'test' }) };
    const mockFetchMeals = jest.fn();
    const mockSnapshot = { val: jest.fn().mockReturnValue({ mealType: 'test' }) };
    const mockUpdate = jest.fn().mockResolvedValue();

    mockDb.update = mockUpdate;

    editMeal('mealKey', mockDb, mockDocument, mockFetchMeals);

    // Adjusted expectation for onValue method call
    expect(mockDb.ref().onValue).toHaveBeenCalled();

    expect(mockDocument.getElementById).toHaveBeenCalledTimes(7);
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockFetchMeals).toHaveBeenCalled();
  });
});

describe('deleteMeal', () => {
  test('deletes a meal from the database', async () => {
    const mockDb = firebaseMock.getDatabase(firebaseMock.initializeApp());
    const mockDocument = {};
    const mockFetchMeals = jest.fn();
    const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(true);
    const mockRemove = jest.fn().mockResolvedValue();

    mockDb.remove = mockRemove;

    await deleteMeal('mealKey', mockDb, mockDocument, mockFetchMeals);

    expect(mockConfirm).toHaveBeenCalled();

    // Adjusted expectation for remove method call
    expect(mockDb.ref().remove).toHaveBeenCalled();

    expect(mockFetchMeals).toHaveBeenCalled();

    mockConfirm.mockRestore();
  });
});

describe('fetchMeals', () => {
  test('fetches meals from the database and updates the UI', () => {
    const mockDb = firebaseMock.getDatabase(firebaseMock.initializeApp());
    const mockDocument = { querySelector: jest.fn().mockReturnValue({ innerHTML: '' }) };
    const mockSnapshot = { val: jest.fn().mockReturnValue({ meal1: {}, meal2: {} }) };
    const mockOnValue = jest.fn((ref, callback) => {
      callback(mockSnapshot);
    });

    mockDb.onValue = mockOnValue;

    fetchMeals(mockDb, mockDocument);

    expect(mockDb.ref().onValue).toHaveBeenCalled();
    expect(mockDocument.querySelector).toHaveBeenCalled();
    expect(mockDocument.querySelector().innerHTML).not.toBe('');
  });
});

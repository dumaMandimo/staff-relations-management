const { addMeal, editMeal, deleteMeal, fetchMeals, firebaseMock } = require('../dist/createMealT');

describe('Firebase Functions', () => {
  let db, document;

  beforeEach(() => {
    db = firebaseMock.getDatabase();
    document = {
      getElementById: jest.fn((id) => {
        if (id === 'mealForm') {
          return {
            addEventListener: jest.fn()
          };
        }
        return {
          value: 'test value',
          reset: jest.fn()
        };
      }),
      querySelector: jest.fn(() => ({
        innerHTML: '',
        insertRow: jest.fn(() => ({
          innerHTML: ''
        }))
      }))
    };
  });

  test('addMeal function', async () => {
    const e = { preventDefault: jest.fn() };
    await addMeal(e, db, document, fetchMeals);
    expect(e.preventDefault).toHaveBeenCalled();
    expect(db.ref).toHaveBeenCalledWith('meals');
    expect(db.ref().push).toHaveBeenCalled();
    expect(document.getElementById('mealForm').reset).toHaveBeenCalled();
  });

  test('fetchMeals function', () => {
    fetchMeals(db, document);
    expect(db.ref).toHaveBeenCalledWith('meals');
    expect(db.ref().onValue).toHaveBeenCalled();
  });

  test('editMeal function', () => {
    const key = 'testKey';
    global.prompt = jest.fn(() => 'new value');
    editMeal(key, db, document, fetchMeals);
    expect(db.ref).toHaveBeenCalledWith(`meals/${key}`);
    expect(db.ref().onValue).toHaveBeenCalled();
  });

  test('deleteMeal function', () => {
    const key = 'testKey';
    global.confirm = jest.fn(() => true);
    deleteMeal(key, db, document, fetchMeals);
    expect(db.ref).toHaveBeenCalledWith(`meals/${key}`);
    expect(db.ref().remove).toHaveBeenCalled();
  });
});

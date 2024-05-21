const { addMeal, firebaseMock } = require('../dist/createMealT');

describe('addMeal', () => {
  beforeEach(() => {
    // Mock necessary DOM elements
    document.body.innerHTML = `
      <form id="mealForm">
        <input id="mealType" value="Breakfast" />
        <input id="protein" value="Eggs" />
        <input id="starch" value="Toast" />
        <input id="fruit" value="Banana" />
        <input id="drink" value="Coffee" />
        <input id="snack" value="Muffin" />
      </form>
      <table id="mealsTable">
        <tbody></tbody>
      </table>
    `;
  });

  it('should add a meal and reset the form', () => {
    const mockEvent = {
      preventDefault: jest.fn()
    };

    // Mock Firebase push method
    const pushMock = jest.fn(() => Promise.resolve());
    firebaseMock.getDatabase().ref.push = pushMock;

    // Call the function to be tested
    addMeal(mockEvent, firebaseMock.getDatabase(), document, jest.fn());

    // Assertions
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith({
      mealType: 'Breakfast',
      protein: 'Eggs',
      starch: 'Toast',
      fruit: 'Banana',
      drink: 'Coffee',
      snack: 'Muffin',
      confirmation: 'Meal Added!'
    });
    expect(document.getElementById('mealForm').reset).toHaveBeenCalled();
  });
});

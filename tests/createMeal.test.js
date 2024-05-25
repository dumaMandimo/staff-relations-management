// tests/createMeal.test.js

const { addMeal, fetchMeals, firebaseMock } = require('../dist/createMealT');

describe('addMeal', () => {
  let pushMock;

  beforeEach(() => {
    // Mock Firebase push method
    pushMock = jest.fn(() => Promise.resolve());
    firebaseMock.getDatabase().ref.mockReturnValue({ push: pushMock });
  });

  it('should add a meal', async () => {
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
    `;

    // Call the function to be tested
    await addMeal({}, firebaseMock.getDatabase(), document, jest.fn());

    // Assertions
    expect(pushMock).toHaveBeenCalledWith({
      mealType: 'Breakfast',
      protein: 'Eggs',
      starch: 'Toast',
      fruit: 'Banana',
      drink: 'Coffee',
      snack: 'Muffin',
      confirmation: 'Meal Added!'
    });
  });
});

describe('fetchMeals', () => {
  it('should fetch meals and display them in the table', () => {
    // Mock necessary DOM elements
    document.body.innerHTML = `
      <table id="mealsTable">
        <tbody></tbody>
      </table>
    `;

    // Mock snapshot value
    const snapshot = {
      val: jest.fn(() => ({
        meal1: { mealType: 'Lunch', protein: 'Chicken', starch: 'Rice' },
        meal2: { mealType: 'Dinner', protein: 'Fish', starch: 'Potato' }
      }))
    };

    // Call the function to be tested
    fetchMeals(firebaseMock.getDatabase(), document);

    // Assertions
    expect(document.querySelectorAll('#mealsTable tbody tr').length).toBe(2);
    expect(document.querySelectorAll('#mealsTable tbody tr')[0].textContent).toContain('Lunch');
    expect(document.querySelectorAll('#mealsTable tbody tr')[0].textContent).toContain('Chicken');
    expect(document.querySelectorAll('#mealsTable tbody tr')[0].textContent).toContain('Rice');
    expect(document.querySelectorAll('#mealsTable tbody tr')[1].textContent).toContain('Dinner');
    expect(document.querySelectorAll('#mealsTable tbody tr')[1].textContent).toContain('Fish');
    expect(document.querySelectorAll('#mealsTable tbody tr')[1].textContent).toContain('Potato');
  });
});

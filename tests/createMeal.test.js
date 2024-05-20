// Import the function to be tested
const { addMeal } = require('../dist/createMealT.js');

describe('addMeal', () => {
  let originalPreventDefault;
  let mockEvent;

  beforeEach(() => {
    // Mock necessary DOM elements
    document.body.innerHTML = `
      <form id="mealForm">
        <input type="text" id="mealType" value="Lunch">
        <input type="text" id="protein" value="Chicken">
        <input type="text" id="starch" value="Rice">
        <input type="text" id="fruit" value="Apple">
        <input type="text" id="drink" value="Water">
        <input type="text" id="snack" value="Chips">
      </form>
    `;

    // Mock event object and preventDefault method
    originalPreventDefault = Event.prototype.preventDefault;
    Event.prototype.preventDefault = jest.fn();
    mockEvent = { preventDefault: jest.fn() };
  });

  afterEach(() => {
    // Restore preventDefault method
    Event.prototype.preventDefault = originalPreventDefault;
  });

  it('should add a meal when form is submitted', () => {
    // Mock Firebase database functions
    const push = jest.fn(() => Promise.resolve());

    // Call the function to be tested
    addMeal(mockEvent);

    // Assertions
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(push).toHaveBeenCalled(); // Ensure push to database is called
    // You can add more assertions to verify the behavior as needed
  });

  it('should reset the form after adding a meal', async () => {
    // Mock Firebase database functions
    const push = jest.fn(() => Promise.resolve());

    // Call the function to be tested
    await addMeal(mockEvent);

    // Assertions
    expect(document.getElementById('mealForm').reset).toHaveBeenCalled();
  });

  // You can write more test cases to cover other scenarios, such as error handling
});

// Import the function to be tested
const { bookMeal, firebaseMock, fetchMealBookings } = require('../dist/eBookMealT');

describe('bookMeal', () => {
  beforeEach(() => {
    // Mock necessary DOM elements
    document.body.innerHTML = `
      <div id="mealsList"></div>
      <table id="bookedMealsTable">
        <tbody></tbody>
      </table>
      <div id="dateBooked"></div>
      <button id="cancelMealBtn"></button>
    `;

    // Mock window.prompt
    window.prompt = jest.fn();
  });

  it('should book a meal when employee name is provided', () => {
    // Mock user input for prompt
    window.prompt.mockReturnValueOnce('John Doe');

    // Mock Firebase push method
    const pushMock = jest.fn(() => Promise.resolve());
    firebaseMock.getDatabase().ref().push = pushMock;

    // Call the function to be tested
    bookMeal('mealKey');

    // Assertions
    expect(window.prompt).toHaveBeenCalledWith('Please enter your name:');
    // Add more assertions as needed
  });

  it('should display an error message when employee name is not provided', () => {
    // Mock user input for prompt
    window.prompt.mockReturnValueOnce('');

    // Call the function to be tested
    bookMeal('mealKey');

    // Assertions
    expect(window.prompt).toHaveBeenCalledWith('Please enter your name:');
    // Add more assertions as needed
  });

  // Add more test cases as needed
});

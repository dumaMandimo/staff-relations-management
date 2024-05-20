// Import the function to be tested
const { fetchAndDisplayEmployees } = require('../dist/aFeedbackT');

describe('fetchAndDisplayEmployees', () => {
  beforeEach(() => {
    // Mock necessary DOM elements
    document.body.innerHTML = `
      <table id="feedbackTable">
        <tbody></tbody>
      </table>
    `;
  });

  it('should fetch and display employees who haven\'t sent feedback', () => {
    // Mock the employees and feedback data
    const employeesSnapshot = {
      forEach: jest.fn()
    };
    const feedbackSnapshot = {
      forEach: jest.fn()
    };

    // Mock Firebase database functions
    const onValue = jest.fn((ref, callback) => {
      if (ref === employeesRef) {
        callback(employeesSnapshot);
      } else if (ref === feedbackRef) {
        callback(feedbackSnapshot);
      }
    });

    // Call the function to be tested
    fetchAndDisplayEmployees();

    // Assertions
    expect(onValue).toHaveBeenCalledTimes(2);
    expect(employeesSnapshot.forEach).toHaveBeenCalled();
    expect(feedbackSnapshot.forEach).toHaveBeenCalled();

    // You can add more specific assertions based on the behavior of your function
  });
});

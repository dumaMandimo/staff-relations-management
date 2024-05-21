// Import the function to be tested
const { fetchAndDisplayEmployees, firebaseMock } = require('../dist/aFeedbackT');

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
      forEach: jest.fn(callback => {
        const employeesData = [
          { key: '1', val: () => ({ name: 'John Doe' }) },
          { key: '2', val: () => ({ name: 'Jane Smith' }) }
        ];
        employeesData.forEach(callback);
      })
    };

    const feedbackSnapshot = {
      forEach: jest.fn(callback => {
        const feedbackData = [
          { val: () => ({ senderId: '1' }) }
        ];
        feedbackData.forEach(callback);
      })
    };

    // Mock Firebase database functions
    const onValue = jest.fn((ref, callback) => {
      if (ref === 'employees') {
        callback(employeesSnapshot);
      } else if (ref === 'feedback') {
        callback(feedbackSnapshot);
      }
    });

    // Call the function to be tested
    fetchAndDisplayEmployees(onValue, 'employees', 'feedback', document);

    // Assertions
    expect(onValue).toHaveBeenCalledTimes(2);
    expect(employeesSnapshot.forEach).toHaveBeenCalled();
    expect(feedbackSnapshot.forEach).toHaveBeenCalled();

    const tableBody = document.querySelector('#feedbackTable tbody');
    expect(tableBody.children.length).toBe(1); // Only one employee without feedback

    const firstRow = tableBody.children[0];
    expect(firstRow.cells[0].textContent).toBe('Jane Smith');
    expect(firstRow.cells[1].textContent).toBe('Request Feedback');
  });
});

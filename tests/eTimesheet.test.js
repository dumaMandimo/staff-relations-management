// bookingModule.test.js
const { addTask, deleteTask, loadTasksFromFirebase, showAlert, calculateDuration, handleSubmit, firebaseMock } = require('../dist/eTimesheetT');

describe('Firebase Mock Tests', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
    document.body.innerHTML = `
      <form id="retrieveTimesheetForm">
        <input type="text" id="userEmail" value="user@example.com" />
        <button type="submit">Submit</button>
      </form>
      <div id="task-list"></div>
      <input type="text" id="employeeName" />
      <input type="text" id="employeeEmail" />
      <input type="text" id="task" />
      <input type="date" id="date" />
      <input type="time" id="startTime" />
      <input type="time" id="endTime" />
      <input type="radio" id="status2" />
      <input type="radio" id="status3" />
      <button id="downloadPDF"></button>
      <button id="downloadCSV"></button>
    `;
  });

  test('should add a new task', () => {
    document.querySelector("#employeeName").value = "John Doe";
    document.querySelector("#employeeEmail").value = "john@example.com";
    document.querySelector("#task").value = "Task A";
    document.querySelector("#date").value = "2023-05-21";
    document.querySelector("#startTime").value = "09:00";
    document.querySelector("#endTime").value = "17:00";
    document.querySelector("#status3").checked = true;

    addTask();

    expect(firebaseMock.push).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        employeeName: "John Doe",
        employeeEmail: "john@example.com",
        task: "Task A",
        date: "2023-05-21",
        duration: "8:00",
        status: "Completed"
      })
    );
    expect(document.querySelector("#employeeName").value).toBe("");
  });

  test('should calculate duration correctly', () => {
    const duration = calculateDuration("09:00", "17:00");
    expect(duration).toBe("8:00");
  });

  test('should show alert', () => {
    showAlert("Test Alert", "info");
    expect(document.querySelector(".alert")).not.toBeNull();
    expect(document.querySelector(".alert").textContent).toBe("Test Alert");
  });

  test('should delete a task', () => {
    deleteTask("task1");
    expect(firebaseMock.remove).toHaveBeenCalledWith(firebaseMock.ref(expect.anything(), 'tasks/task1'));
  });

  test('should handle form submission', () => {
    const mockEvent = { preventDefault: jest.fn() };
    document.querySelector("#userEmail").value = "user@example.com";

    handleSubmit(mockEvent);

    expect(firebaseMock.onValue).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
  });
});

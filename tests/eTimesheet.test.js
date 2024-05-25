const {
  addTask,
  deleteTask,
  loadTasksFromFirebase,
  showAlert,
  calculateDuration,
  handleSubmit,
  downloadTimesheet,
  firebaseMock
} = require('../dist/eTimesheetT');

jest.useFakeTimers();

describe('showAlert', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should display an alert message', () => {
    showAlert('Test Message', 'success');
    const alert = document.querySelector('.alert-success');
    expect(alert).not.toBeNull();
    expect(alert.textContent).toBe('Test Message');
  });
}); // <- Add this closing brace

describe('calculateDuration', () => {
  it('should calculate the correct duration', () => {
    const duration = calculateDuration('08:00', '10:30');
    expect(duration).toBe('2:30');
  });
});

describe('addTask', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="employeeName" value="John Doe">
      <input id="employeeEmail" value="john@example.com">
      <input id="task" value="Test Task">
      <input id="date" value="2024-05-25">
      <input id="startTime" value="09:00">
      <input id="endTime" value="11:00">
      <input type="radio" id="status2">
      <input type="radio" id="status3">
    `;
    firebaseMock.ref.mockReturnValue({
      push: jest.fn()
    });
  });

  it('should add a new task and display a success alert', () => {
    addTask();

    expect(firebaseMock.ref).toHaveBeenCalledWith('tasks');
    expect(firebaseMock.ref().push).toHaveBeenCalledWith({
      employeeName: 'John Doe',
      employeeEmail: 'john@example.com',
      task: 'Test Task',
      date: '2024-05-25',
      duration: '2:00',
      status: ''
    });

    const alert = document.querySelector('.alert-success');
    expect(alert).not.toBeNull();
    expect(alert.textContent).toBe('Task Added!');
  });
});

describe('deleteTask', () => {
  beforeEach(() => {
    firebaseMock.ref.mockReturnValue({
      remove: jest.fn()
    });
  });

  it('should delete the task and display a danger alert', () => {
    deleteTask('taskId123');

    expect(firebaseMock.ref).toHaveBeenCalledWith(expect.anything(), 'tasks/taskId123');
    expect(firebaseMock.ref().remove).toHaveBeenCalled();

    const alert = document.querySelector('.alert-danger');
    expect(alert).not.toBeNull();
    expect(alert.textContent).toBe('Task Deleted!');
  });
});

describe('loadTasksFromFirebase', () => {
  beforeEach(() => {
    document.body.innerHTML = '<table><tbody id="task-list"></tbody></table>';
  });

  it('should load tasks for the given email', () => {
    const mockTasks = {
      task1: {
        employeeName: 'John Doe',
        employeeEmail: 'john@example.com',
        task: 'Test Task',
        date: '2024-05-25',
        duration: '2:00',
        status: 'In Progress'
      }
    };

    const mockSnapshot = {
      val: jest.fn(() => mockTasks)
    };

    firebaseMock.onValue.mockImplementationOnce((ref, callback) => {
      callback(mockSnapshot);
    });

    loadTasksFromFirebase('john@example.com');

    const tableBody = document.querySelector('#task-list');
    expect(tableBody.children.length).toBe(1);
    expect(tableBody.children[0].innerHTML).toContain('John Doe');
  });

  it('should show an alert if no tasks are found', () => {
    const mockSnapshot = {
      val: jest.fn(() => null)
    };

    firebaseMock.onValue.mockImplementationOnce((ref, callback) => {
      callback(mockSnapshot);
    });

    loadTasksFromFirebase('john@example.com');

    const alert = document.querySelector('.alert-info');
    expect(alert).not.toBeNull();
    expect(alert.textContent).toBe('No tasks found!');
  });
});

describe('handleSubmit', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="retrieveTimesheetForm">
        <input id="userEmail" value="john@example.com">
      </form>
      <table><tbody id="task-list"></tbody></table>
    `;
  });

  it('should load tasks on form submission', async () => {
    const form = document.querySelector('#retrieveTimesheetForm');
    const event = new Event('submit');
    jest.spyOn(event, 'preventDefault');

    await handleSubmit(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(firebaseMock.onValue).toHaveBeenCalled();
  });

  it('should show an alert if email is empty', async () => {
    document.querySelector('#userEmail').value = '';
    const form = document.querySelector('#retrieveTimesheetForm');
    const event = new Event('submit');
    jest.spyOn(event, 'preventDefault');

    await handleSubmit(event);

    const alert = document.querySelector('.alert-danger');
    expect(alert).not.toBeNull();
    expect(alert.textContent).toBe('Please enter an email address.');
  });
});

describe('downloadTimesheet', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <table id="task-list">
        <tr>
          <td>John Doe</td>
          <td>john@example.com</td>
          <td>Test Task</td>
          <td>2024-05-25</td>
          <td>2:00</td>
          <td>In Progress</td>
          <td><button class="edit" data-id="task1">Edit</button><button class="delete" data-id="task1">Delete</button></td>
        </tr>
      </table>
    `;
  });

  it('should download the timesheet as CSV', () => {
    downloadTimesheet('csv');
    const link = document.querySelector('a[download="timesheet.csv"]');
    expect(link).not.toBeNull();
  });
});
const puppeteer = require('puppeteer');

describe('Employee Timesheet', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('/eTimesheet.html');
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Add Task', async () => {
    await page.type('#employeeId', '123');
    await page.type('#task', 'Sample Task');
    await page.type('#date', '2024-05-01');
    await page.type('#startTime', '09:00');
    await page.type('#endTime', '10:30');
    await page.click('#status3');
    await page.click('#addTask');

    // Wait for the task to be added (you may need to adjust the selector)
    await page.waitForSelector('#task-list tr');

    const tasks = await page.$$eval('#task-list tr', rows =>
      rows.map(row => ({
        employeeId: row.cells[0].textContent,
        task: row.cells[1].textContent,
        date: row.cells[2].textContent,
        duration: row.cells[3].textContent,
        status: row.cells[4].textContent,
      }))
    );

    const lastTask = tasks[tasks.length - 1];
    expect(lastTask.employeeId).toBe('123');
    expect(lastTask.task).toBe('Sample Task');
    expect(lastTask.date).toBe('2024-05-01');
    expect(lastTask.duration).toBe('1:30'); // Duration calculated correctly
    expect(lastTask.status).toBe('Completed');
  });
});

// inputtingTimeSheet.test.js

const TimeSheet = require('../timeSheet');

describe('Inputting Time Sheet', () => {
  test('Input time sheet', () => {
    const timeSheet = new TimeSheet();
    const entry = { date: '2024-04-29', hoursWorked: 8, task: 'Project A' };
    timeSheet.inputTimeSheet(entry);
    expect(timeSheet.getTimeSheet()).toContainEqual(entry);
  });
});

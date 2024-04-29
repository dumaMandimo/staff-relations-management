// displayingTimeSheet.test.js

const TimeSheet = require('../timeSheet');

describe('Displaying Time Sheet', () => {
  test('Display time sheet', () => {
    const timeSheet = new TimeSheet();
    const timeSheetData = [
      { date: '2024-04-29', hoursWorked: 8, task: 'Project A' },
      { date: '2024-04-30', hoursWorked: 6, task: 'Project B' },
    ];
    timeSheet.loadTimeSheetData(timeSheetData);
    expect(timeSheet.displayTimeSheet()).toEqual(timeSheetData);
  });
});

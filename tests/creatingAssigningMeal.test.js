// creatingAssigningMeals.test.js

const Manager = require('../manager');

describe('Creating and Assigning Meals', () => {
  test('Manager can create and assign meals', () => {
    const manager = new Manager();
    const meal = { name: 'Lunch', type: 'Vegetarian' };
    const user = { username: 'staff1', role: 'staff' };
    manager.createAndAssignMeal(meal, user.username);
    expect(manager.getAssignedMeals(user.username)).toContainEqual(meal);
  });
});

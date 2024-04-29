// removingAccess.test.js

const UserManagement = require('../userManagement');

describe('Removing Access', () => {
  test('Admin can remove access for a user', () => {
    const userManagement = new UserManagement();
    const staffUser = { username: 'staff1', role: 'staff' };
    userManagement.onboardStaff(staffUser);
    userManagement.removeAccess(staffUser.username);
    expect(userManagement.getStaff()).not.toContain(staffUser);
  });
});

// changingPermissions.test.js

const UserManagement = require('../userManagement');

describe('Changing Permissions', () => {
  test('Admin can change permissions for a user', () => {
    const userManagement = new UserManagement();
    const staffUser = { username: 'staff1', role: 'staff' };
    userManagement.onboardStaff(staffUser);
    userManagement.changePermissions(staffUser.username, 'manager');
    expect(userManagement.getPermissions(staffUser.username)).toBe('manager');
  });
});

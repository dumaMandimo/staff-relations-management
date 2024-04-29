const UserManagement = require('../userManagement');

describe('Onboarding Staff', () => {
  test('Admin can onboard staff', () => {
    const userManagement = new UserManagement();
    const staffUser = { username: 'staff1', role: 'staff' };
    userManagement.onboardStaff(staffUser);
    expect(userManagement.getStaff()).toContain(staffUser);
  });
});

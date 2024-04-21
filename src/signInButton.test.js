// Import the script file
const script = require('./script.js');

describe('Sign In Button', () => {
  beforeEach(() => {
    // Create a mock for the alert function
    global.alert = jest.fn();
    
    // Create a mock DOM environment
    document.body.innerHTML = `
      <button id="signinButton" type="submit">Sign In</button>
    `;
    
    // Call the function to attach the event listener
    script.setupSignInButton();
  });

  it('should display an alert when Sign In button is clicked', () => {
    // Trigger a click event on the "Sign In" button
    document.getElementById('signinButton').click();

    // Verify that the alert function was called with the correct message
    expect(global.alert).toHaveBeenCalledWith('You clicked Sign In');
  });
});

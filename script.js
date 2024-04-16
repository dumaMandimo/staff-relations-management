

function setupSignInButton() {
  document.getElementById('signinButton').addEventListener('click', function () {
    alert('You clicked Sign In');
  });
}

// Export the setupSignInButton function for the test
module.exports = { setupSignInButton };


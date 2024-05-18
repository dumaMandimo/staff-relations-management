document.addEventListener('DOMContentLoaded', function() {
  var sidebar = document.querySelector('.sidebar');
  var toggleBtn = document.querySelector('.toggle-btn');
  var content = document.querySelector('.content');

  toggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('minimized');
  });

  // Get the links from the sidebar
  const links = document.querySelectorAll('.sidebar nav ul li a');

  links.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault(); // Prevent the default link behavior

      // Load the content based on the clicked link
      const contentContainer = document.getElementById('contentContainer');
      if (link.textContent.trim() === 'Timesheets') {
        fetch('eTimesheet.html')
          .then(response => response.text())
          .then(html => {
            contentContainer.innerHTML = html;
          })
          .catch(error => console.error('Error loading content:', error));
      } else if (link.textContent.trim() === 'Carwash') {
        fetch('eBooking.html')
          .then(response => response.text())
          .then(html => {
            contentContainer.innerHTML = html;
          })
          .catch(error => console.error('Error loading content:', error));
      } else if (link.textContent.trim() === 'Meal Booking') {
        fetch('eBookMeal.html')
          .then(response => response.text())
          .then(html => {
            contentContainer.innerHTML = html;
          })
          .catch(error => console.error('Error loading content:', error));
      }
    });
  });
});
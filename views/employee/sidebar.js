document.addEventListener('DOMContentLoaded', function() {
  var sidebar = document.querySelector('.sidebar');
  var toggleBtn = document.querySelector('.toggle-btn');
  var content = document.querySelector('.content');

  toggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('minimized');
  });
});
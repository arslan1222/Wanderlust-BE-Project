(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  // const toggleButton = document.querySelector('.navbar-toggler');
  // const sidebarToggleButton = document.querySelector('.sidebar-toggler');
  // const sidebar = document.getElementById('sidebar');
  
  // const toggleSidebar = () => {
  //   sidebar.classList.toggle('show');
  
  //   // Toggle visibility of the navbar toggle button
  //   if (sidebar.classList.contains('show')) {
  //     toggleButton.style.display = 'none'; // Hide navbar toggle button
  //   } else {
  //     toggleButton.style.display = 'block'; // Show navbar toggle button
  //   }
  // };
  
  // // Add event listeners for both buttons
  // toggleButton.addEventListener('click', toggleSidebar);
  // sidebarToggleButton.addEventListener('click', toggleSidebar);
  

  document.querySelector('.navbar-toggler').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('show');
  });
  
  document.querySelector('.sidebar-toggler').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('show');
  });
  

  function toggleFilters() {
    const filters = document.getElementById('filters');
    if (filters.style.display === 'none' || filters.style.display === '') {
        filters.style.display = 'block'; // Show the filters
    } else {
        filters.style.display = 'none'; // Hide the filters
    }
}

  


document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch plate data from the server
    function fetchPlateData() {
        fetch('/video_feed')
            .then(response => response.json())
            .then(data => {
                // Once the data is received, display the popup with the plate information
                displayPopup(data);

                // You can continue executing code here
                console.log('Data received:', data);
            })
            .catch(error => {
                console.error('Error fetching plate data:', error);
            });
    }

    // Function to display popup with plate data
    function displayPopup(data) {
        // Set the input values in the form with the plate data
        document.getElementById('vehicleNumber').value = data.plate_number;
        document.getElementById('assignedSlot').value = data.slot;
        document.getElementById('date').value = data.date;
        document.getElementById('time').value = data.time;

        // Show the popup
        const popup = document.getElementById('home-popup1');
        popup.classList.add('active-popup');
    }

    // Call the fetchPlateData function to fetch and display plate data
    fetchPlateData();

    // Continue executing code here or call other functions as needed
});

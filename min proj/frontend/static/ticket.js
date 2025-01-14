// document.addEventListener('DOMContentLoaded', function() {
//     function fetchDetectionData() {
//         fetch('/api/detection')
//             .then(response => response.json())
//             .then(data => {
//                 fillForm(data);
//             })
//             .catch(error => console.error('Error fetching detection data:', error));
//             document.getElementById('popupbtn').addEventListener('click', function () {
//                 var popup = document.getElementById('home-popup1');
//                 popup.classList.toggle('visible');
//             });
//     }

//     function fillForm(data) {
//         document.getElementById('vehicleNumber').value = data.plate_number || '';
//         document.getElementById('assignedSlot').value = data.slot || '';
//         document.getElementById('date').value = data.date || '';
//         document.getElementById('time').value = data.time || '';
//     }

//     // Fetch data when the page loads
//     fetchDetectionData();
// });

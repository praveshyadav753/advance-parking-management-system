// Function to fetch and display history records
function displayHistoryTable() {
    // Fetch history records from the server
    fetch('/history')
        .then(response => response.json())
        .then(records => {
            // Sort records based on the selected option
            const sortBy = document.getElementById('sort').value;
            records.sort((a, b) => {
                switch (sortBy) {
                    case 'slot':
                        return a.assignedSlot - b.assignedSlot;
                    case 'vehicleNumber':
                        return a.vehicleNumber.localeCompare(b.vehicleNumber);
                    case 'date':
                        return new Date(a.entryDate) - new Date(b.entryDate);
                    default:
                        return 0; // Default sorting
                }
            });

            // Clear existing table rows
            const tableBody = document.getElementById('recordsBody');
            tableBody.innerHTML = '';

            // Iterate over records and add rows to the table
            let serialNumber = 1;
            records.forEach(record => {
                const row = `
                    <tr>
                        <td>${serialNumber}</td>
                        <td>${record._id || '-'}</td>
                        <td>${record.entryDate || '-'}</td>
                        <td>${record.assignedSlot || '-'}</td>
                        <td>${record.vehicleNumber || '-'}</td>
                        <td>${record.ownerName || '-'}</td>
                        <td><button onclick="showDetails('${record._id}')">Details</button></td>
                    </tr>
                `;
                tableBody.innerHTML += row;
                serialNumber++;
            });
        })
        .catch(error => console.error('Error fetching history records:', error));
}

// Call the function to display history table when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    displayHistoryTable();
});

function toggleDropdown() {
    var dropdown = document.getElementById("sortOptions");
    dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
}

function sortBy(option) {
    // Handle sorting by the selected option
    console.log("Sort by: " + option);
    toggleDropdown(); // Close dropdown after selection
}

// Close dropdown when clicking outside
window.onclick = function(event) {
    if (!event.target.matches('.dropdown-button')) {
        var dropdown = document.getElementById("sortOptions");
        if (dropdown.style.display === "block") {
            dropdown.style.display = "none";
        }
    }
}

// Function to change number of entries displayed in the table
function changeEntries() {
    var table = document.getElementById("myTable");
    var entries = document.getElementById("entries").value;
    
    // Show only the selected number of rows
    var rows = table.rows;
    for (var i = 1; i < rows.length; i++) {
        if (i <= entries) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

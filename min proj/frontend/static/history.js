let records = []; // Declare records as a global variable

// Function to fetch and display history records
async function displayHistoryTable() {
    try {
        // Fetch history records from the server
        const response = await fetch('/history');
        if (!response.ok) throw new Error('Failed to fetch history records');

        records = await response.json(); // Store fetched records in the global variable

        
        

        // Render the sorted and paginated data
        renderTable(records);

    } catch (error) {
        console.error('Error fetching history records:', error);
    }
}

function renderTable(paginatedData) {
    const tableBody = document.getElementById('recordsBody');
    tableBody.innerHTML = paginatedData.map((record, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${record._id || '-'}</td>
            <td>${record.entryDate || '-'}</td>
            <td>${record.assignedSlot || '-'}</td>
            <td>${record.vehicleNumber || '-'}</td>
            <td>${record.ownerName || '-'}</td>
            <td><button onclick="showDetails('${record._id}')">Details</button></td>
        </tr>
    `).join('');
}

// Event listener to change number of displayed entries
const toshow = document.getElementById('entries');
toshow.addEventListener("change", (event) => {
    let entries = event.target.value;
    if (!isNaN(entries)) {
        entries = parseInt(entries);
    } else {
        entries = records.length; // Use records.length instead of record.length
    }

    // Paginate data based on entries
    const paginatedData = records.slice(0, entries);
    renderTable(paginatedData);
});

// Attach event listener to load history table on button click
document.getElementById('history').addEventListener('click', () => {
    console.log('Loading history...');
    displayHistoryTable();
});

// Dropdown toggle function
function toggleDropdown() { 
    const dropdown = document.getElementById('sortOptions');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Function to handle sorting by option
function sortBy(option) {
    console.log('Sort by:', option);
    toggleDropdown(); // Close dropdown
    displayHistoryTable(); // Refresh table with new sorting
}
  function filterealldata() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const slotNumber = document.getElementById('slotNumber').value.toLowerCase();
        const vehicleType = document.getElementById('vehicleType').value;
        const paymentStatus = document.getElementById('paymentStatus').value;
        const entryTime = document.getElementById('entrytime').value;
        const exitTime = document.getElementById('exittime').value;

        // Get sorting option
        const sortBy = document.getElementById('sort').value;

        // Filter records based on filter values
        const filteredRecords = records.filter(record => {
            const matchesDate =
                (!startDate || new Date(record.entryDate) >= new Date(startDate)) &&
                (!endDate || new Date(record.entryDate) <= new Date(endDate));

            const matchesSlot = slotNumber ? (record.assignedSlot && record.assignedSlot.toString().toLowerCase().includes(slotNumber)) : true;
            const matchesVehicleType = vehicleType ? record.vehicleType === vehicleType : true;
            const matchesPaymentStatus = paymentStatus ? record.paymentStatus === paymentStatus : true;
            const matchesEntryTime = entryTime ? record.entryTime.startsWith(entryTime) : true;
            const matchesExitTime = exitTime ? record.exitTime.startsWith(exitTime) : true;
            
            return matchesDate &&
                matchesSlot &&
                matchesVehicleType &&
                matchesPaymentStatus &&
                matchesEntryTime &&
                matchesExitTime;
        });

        // Sort filtered records based on the selected option
        filteredRecords.sort((a, b) => {
            switch (sortBy) {
                case 'slot': return a.assignedSlot - b.assignedSlot;
                case 'vehicleNumber': return a.vehicleNumber.localeCompare(b.vehicleNumber);
                case 'date': return new Date(a.entryDate) - new Date(b.entryDate);
                default: return 0;
            }
        });

        // Render the sorted and filtered data
        console.log(filteredRecords)
        renderTable(filteredRecords);
    }
// Close dropdown when clicking outside

document.getElementById('apply_filter').addEventListener('click', () => {
    const filter = document.getElementById('filter');
    const closeFilter = document.getElementById('closeFilter');
    const history = document.getElementById('history2');

    filterealldata();
    filter.style.display = 'none';
    history.classList.remove('fade-out');

});
window.addEventListener('click', (event) => {
    if (!event.target.closest('.dropdown-button')) {
        const dropdown = document.getElementById('sortOptions');
        dropdown.style.display = 'none';
    }
});



// Filter box display logic
document.addEventListener('DOMContentLoaded', () => {
    const filterLink = document.getElementById('filterLink');
    const filter = document.getElementById('filter');
    const closeFilter = document.getElementById('closeFilter');
    const history = document.getElementById('history2');

    // Show filter box
    filterLink.addEventListener('click', (event) => {
        event.preventDefault();
        filter.style.display = 'block';
        history.classList.add('fade-out');
    });

    // Hide filter box
    closeFilter.addEventListener('click', () => {
        filter.style.display = 'none';
        history.classList.remove('fade-out');
    });

    // Hide filter box when clicking outside
    document.addEventListener('click', (event) => {
        if (!filter.contains(event.target) && event.target !== filterLink) {
            filter.style.display = 'none';
            history.classList.remove('fade-out');
        }
    });
});

// import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

// const socket = io('http://127.0.0.1:5001');

// // Handle parking data received via Socket.IO
// socket.on('parking_data', (data) => {
//     console.log('parking_data:', data); // Process and display detection data if needed

//     // Get form elements
//     const vehicleNumberInput = document.getElementById('vehicleNumber');
//     const assignedSlotInput = document.getElementById('assignedSlot');
//     const mobileNumberInput = document.getElementById('mobileNumber');
//     const ownersNameInput = document.getElementById('ownersName');
//     const dateInput = document.getElementById('date');
//     const timeInput = document.getElementById('time');
//     const vehicleType = document.querySelector('input[name="vehicleType"]:checked').value;


//     // Insert data into the form fields
//     vehicleNumberInput.value = data.Vehicle_Number || '';
//     assignedSlotInput.value = data.assigned_slot || ''; 
//     dateInput.value =data.entry_date;  
//     timeInput.value = data.entry_time; 
    
//     // Trigger the popup visibility when parking data is received
//     const popup = document.getElementById('home-popup1');
//     popup.classList.toggle('visible');  // Toggle the visibility of the popup
// });

// // Handle popup behavior on button clicks
// document.addEventListener('DOMContentLoaded', function () {
//     const popup = document.getElementById('home-popup1');
    
//     // Toggle popup visibility on 'popupbtn' click
//     document.getElementById('popupbtn').addEventListener('click', function () {
//         popup.classList.toggle('visible');
//     });
//     const ticketview = document.getElementById('ticketprnt');
//     // Close the popup and ticket view on close-w button click
//     document.querySelector('.close-w').addEventListener('click', function () {
//         popup.classList.remove('visible');
//         allowscan(True)
//         ticketview.classList.remove('visible1');
//     });

//     // Toggle ticket view on 'viewTicketButton' click
//     document.getElementById('viewTicketButton').addEventListener('click', function () {
//         // var ticketview = document.getElementById('ticketprnt');
//         ticketview.classList.toggle('visible1');
//     });

//     // Handle ticket fetch functionality
//     const viewTicketButton = document.getElementById('viewTicketButton');
//     const printTicketButton = document.getElementById('printTicketButton');
//     const ticketForm = document.getElementById('home-popup1');

//     // View ticket on button click
//     viewTicketButton.addEventListener('click', function () {
//         // const formData = new FormData(ticketForm);
//         printTicket(ticketData);
//         fetchTicketData(formData, 'view');
//     });

//     // Print ticket on button click
//     printTicketButton.addEventListener('click', function () {
//         const formData = new FormData(ticketForm);
//         ticketview.classList.remove('visible1');
//         fetchTicketData(formData, 'print');
//         allowscan(True)
//     });

//     async function allowscan(allow)
//     {
        
//        await fetch(`http://127.0.0.1:5000/api/${allow}`, {
//             method: 'GET'
//         })
//         .then(response => {
//             if (response.ok) {
//                 console.log("Request sent successfully");
//             }
//         })
//         .catch(error => {
//             console.error("Error sending request:", error);
//         });
//     }

//     // Fetch ticket data based on the action (view or print)
//     function fetchTicketData(formData, action) {
//         const vehicleNumber = formData.get('vehicleNumber');
//         fetch(`/get_ticket_data?vehicleNumber=${vehicleNumber}`)
//             .then(response => response.json())
//             .then(data => {
//                 if (action === 'view') {
//                     viewTicket(data);
//                 } else if (action === 'print') {
//                     printTicket(data);
//                 }
//             })
//             .catch(error => console.error('Error fetching ticket data:', error));
//     }

//     // View ticket function
//     function viewTicket(ticketData) {
//         // Display the ticket in a modal or a new page
//         console.log("View Ticket:", ticketData);
//         printTicket(ticketData);
//     }

//     // Print ticket function
//     function printTicket(ticketData) {
//         // Format the ticket data into HTML
//         const ticketHTML = `
//     <div id="tick" class="ticketprint">
//         <div class="ticket-header">
//             <div class="logo">
//                 <img src="/static/LOGO.png" alt="Logo">
//             </div>
//             <h1>Parking Ticket</h1>
//         </div>
//         <div class="ticket-details">
//             <p><span class="details-label">City:</span> <span id="city">${ticketData.city}</span></p>
//             <p><span class="details-label">State:</span> <span id="state">${ticketData.state}</span></p>
//             <p><span class="details-label">Zip Code:</span> <span id="code">${ticketData.code}</span></p>
//             <p><span class="details-label">Contact:</span> <span id="contact-d">${ticketData.contact}</span></p>
//             <p><span class="details-label">Ticket ID:</span> <span id="tiketid">${ticketData.tiketid}</span></p>
//             <p><span class="details-label">Date/Time Issued:</span> <span id="datetime">${ticketData.datetime}</span></p>
//             <p><span class="details-label">Vehicle Plate:</span> <span id="vehiclenum">${ticketData.vehiclenum}</span></p>
//             <p><span class="details-label">Slot:</span> <span id="slotnum">${ticketData.slotnum}</span></p>
//         </div>
//         <div class="payment-details">
//             <h3>Payment Details:</h3>
//             <p><span class="details-label">Payment:</span> ${ticketDetails.payment}</p>
//         </div>
//         <div class="barcode">
//             <img src="/static/barcode.jpg" alt="Barcode">
//         </div>
//     </div>
// `;
//  document.getElementById('ticketprnt').innerHTML =ticketHTML;


//         // Open a new window and print the ticket
//         // const printWindow = window.open('', '', 'height=600,width=800');
//         // printWindow.document.write(ticketHtml);
//         // printWindow.document.close();
//         // printWindow.print();
//     }    
// });




import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

const socket = io('http://127.0.0.1:5001');

// Handle parking data received via Socket.IO
socket.on('parking_data', (data) => {
    console.log('parking_data:', data); // Process and display detection data if needed

    // Get form elements
    

    

    // Insert data into the form fields
    vehicleNumberInput.value = data.Vehicle_Number || '';
    assignedSlotInput.value = data.assigned_slot || ''; 
    dateInput.value = data.entry_date;  
    timeInput.value = data.entry_time; 

    // Trigger the popup visibility when parking data is received
    const popup = document.getElementById('home-popup1');
    popup.classList.toggle('visible');  // Toggle the visibility of the popup
});

// Handle popup behavior on button clicks
document.addEventListener('DOMContentLoaded', function () {
    let ticketData; 


    function fetchTicketData() {
        
                const vehicleNumberInput = document.getElementById('vehicleNumber');
        const assignedSlotInput = document.getElementById('assignedSlot');
        const mobileNumberInput = document.getElementById('mobileNumber');
        const ownersNameInput = document.getElementById('ownersName');
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const vehicleType = document.querySelector('input[name="vehicleType"]:checked')?.value;
    
        // Create and return the ticket data object
        return {
            vehiclenum: vehicleNumberInput.value || 'N/A',
            slotnum: assignedSlotInput.value || 'N/A',
            datetime: `${dateInput.value} ${timeInput.value}` || 'N/A',
            vehicleType: vehicleType || 'N/A',
            code: "4542010",
            city: "Indore",
            state: "Madhya Pradesh",
            contact: mobileNumberInput.value || 'N/A',
            ownersName: ownersNameInput.value || 'N/A',
            tiketid: 12345,
            payment: "100"
        };
    }
    const popup = document.getElementById('home-popup1');
    
    // Toggle popup visibility on 'popupbtn' click
    document.getElementById('popupbtn').addEventListener('click', function () {
        popup.classList.toggle('visible');
    });
    
    const ticketview = document.getElementById('ticketprnt');
    
    // Close the popup and ticket view on close-w button click
    document.querySelector('.close-w').addEventListener('click', function () {
        popup.classList.remove('visible');
        // allowscan(true);
        ticketview.classList.remove('visible1');
    });

    // Toggle ticket view on 'viewTicketButton' click
    document.getElementById('viewTicketButton').addEventListener('click', function () {
       ticketData= fetchTicketData();   
       viewTicket(ticketData);
        ticketview.classList.toggle('visible1');

    });

    // Handle ticket fetch functionality
    const printTicketButton = document.getElementById('printTicketButton');
    const ticketForm = document.getElementById('home-popup1');

    // Print ticket on button click
    printTicketButton.addEventListener('click', function () {
        
        // const formData = new FormData(ticketForm);
        
        ticketData=fetchTicketData();
        popup.classList.remove('visible');
        // const tickett=printTicketformat()
        printTicket(ticketData)
        
        // allowscan(true);
    });
    // View ticket function
    function viewTicket(ticketData) {
        
       const ticketHTML=printTicketformat(ticketData);
       document.getElementById('ticketprnt').innerHTML = ticketHTML;
    }
    function printTicket(ticketData)
    { const ticketHTML=`
        <html>
        <head>
            <style>
                /* Include your styles here */
                @media print{
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f9f9f9;
                }
                .ticketprint {
    width: 300px;
    margin: 20px auto;
    background-color: #fff;
    border: 5px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: relative;
    display: block;
    z-index: 2000;
    page-break-after: always;
}

.ticketprint.visible1 {
    transform: scale(1);
}

.ticket-header {
    text-align: center;
    margin-bottom: 20px;
}

.ticket-header .logo {
    margin-bottom: 10px;
}

.ticket-header h1 {
    font-size: 1.5em;
    color: #333;
    margin: 0;
}

.ticket-details {
    margin-bottom: 20px;
    font-size: 1em;
}

.ticket-details p {
    margin: 5px 0;
}

.details-label {
    font-weight: bold;
}

.payment-details {
    background-color: #f1f1f1;
    padding: 10px;
    border-radius: 5px;
    margin-top: 20px;
}

.payment-details h3 {
    margin: 0 0 10px;
    font-size: 1.1em;
}

.payment-details p {
    margin: 5px 0;
}

.barcode {
    text-align: center;
    margin-top: 20px;
}

.barcode img {
    width: 200px;
    height: 100px;
    display: block;
    margin: 0 auto;
    transition: transform 0.3s ease-in-out;
}

.barcode img:hover {
    transform: scale(1.1);
}

.logo img {
    max-width: 100px;
    max-height: 100px;
    background-color: rgb(218, 218, 218);
}
    }

                
            </style>
        </head>
        <body>
            <div class="ticketprint">
                <div class="ticket-header">
                    <div class="logo">
                        <img src="LOGO.png" alt="Logo" style="width:100px;">
                    </div>
                    <h1>Parking Ticket</h1>
                </div>
                <div class="ticket-details">
                    <p><span class="details-label">City:</span> <span id="city">${ticketData.city || 'N/A'}</span></p>
                    <p><span class="details-label">State:</span> <span id="state">${ticketData.state || 'N/A'}</span></p>
                    <p><span class="details-label">Zip Code:</span> <span id="code">${ticketData.code || 'N/A'}</span></p>
                    <p><span class="details-label">Contact:</span> <span id="contact-d">${ticketData.contact || 'N/A'}</span></p>
                    <p><span class="details-label">Ticket ID:</span> <span id="ticketid">${ticketData.tiketid || 'N/A'}</span></p>
                    <p><span class="details-label">Date/Time Issued:</span> <span id="datetime">${ticketData.datetime || 'N/A'}</span></p>
                    <p><span class="details-label">Vehicle Plate:</span> <span id="vehiclenum">${ticketData.vehiclenum || 'N/A'}</span></p>
                    <p><span class="details-label">Slot:</span> <span id="slotnum">${ticketData.slotnum || 'N/A'}</span></p>
                </div>
                <div class="payment-details">
                    <h3>Payment Details:</h3>
                    <p><span class="details-label">Payment:</span> Rs. ${ticketData.payment || '0'}</p>
                </div>
                <div class="barcode">
                    <img src="/static/barcode.jpg" alt="Barcode">
                </div>
            </div>
        </body>
        </html>
    `;


        const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(ticketHTML);
    printWindow.document.close();
    printWindow.print();
    }


    
    // Print ticket function
    function printTicketformat(ticketData) {
        const ticketHTML = `
            
                <div class="ticket-header">
                    <div class="logo">
                        <img src="../static/LOGO.png" alt="Logo">
                    </div>
                    <h1>Parking Ticket</h1>
                </div>
                <div class="ticket-details">
                    <p><span class="details-label">City:</span> <span id="city">${ticketData.city || 'N/A'}</span></p>
                    <p><span class="details-label">State:</span> <span id="state">${ticketData.state || 'N/A'}</span></p>
                    <p><span class="details-label">Zip Code:</span> <span id="code">${ticketData.code || 'N/A'}</span></p>
                    <p><span class="details-label">Contact:</span> <span id="contact-d">${ticketData.contact || 'N/A'}</span></p>
                    <p><span class="details-label">Ticket ID:</span> <span id="ticketid">${ticketData.ticketid || 'N/A'}</span></p>
                    <p><span class="details-label">Date/Time Issued:</span> <span id="datetime">${ticketData.datetime || 'N/A'}</span></p>
                    <p><span class="details-label">Vehicle Plate:</span> <span id="vehiclenum">${ticketData.vehiclenum || 'N/A'}</span></p>
                    <p><span class="details-label">Slot:</span> <span id="slotnum">${ticketData.slotnum || 'N/A'}</span></p>
                </div>
                <div class="payment-details">
                    <h3>Payment Details:</h3>
                    <p><span class="details-label">Payment:</span> Rs. ${ticketData.payment || '0'}</p>
                </div>
                <div class="barcode">
                    <img src="../static/barcode.jpg" alt="Barcode">
                </div>
            
        `;
        return ticketHTML;

        
        
        // Open a new window and print the ticket
        // const printWindow = window.open('', '', 'height=600,width=800');
        // printWindow.document.write(ticketHTML);
        // printWindow.document.close();
        // printWindow.print();
    }    
});

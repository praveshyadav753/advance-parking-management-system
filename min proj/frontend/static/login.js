//......................concept of login button .............................................

const popup = document.querySelector('.login-icon');
const close = document.querySelector('.close');
const wrapper = document.querySelector('.wrapper'); // Make sure to define 'wrapper'

// Correctly spelled 'addEventListener'
popup.addEventListener('click', () => {
    wrapper.classList.add('active-popup'); 
});

close.addEventListener('click', () => {
    wrapper.classList.remove('active-popup'); // Hide the popup
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(this); // Create a FormData object from the form

        fetch('/login', {
            method: 'POST',
            body: new URLSearchParams(formData), // Send the form data in the request body
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // Set the request header
            }
        })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            if (data.success) {
                alert('Login successful'); // Display a success message
                window.location.href = '/main-content'; // Redirect to the main content page
            } else {
                alert('Login failed: ' + data.message); // Display an error message
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Request failed'); // Display a generic error message
        });
    });
});

//=================================================================================
// Get the video element

document.addEventListener('DOMContentLoaded', function() {
    const videoElement = document.getElementById('entry');
    videoElement.src = "/entry-gate";
});




//...................................x.........x............x.........x...........x............x.........x...........x








///////////////////////////////////////////////////////////////////...........................................///////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function() {
    // Get references to menu items and content sections
    const homeMenu = document.getElementById('home');
    const setupMenu = document.getElementById('setup');
    const historyMenu = document.getElementById('history');
    const gateViewMenu = document.getElementById('entry2');

    const homeSection = document.getElementById('above-parking');
    const setupSection = document.getElementById('setup1');
    const historySection = document.getElementById('history1');
    const gateViewSection = document.getElementById('entry1');
    const parkingLayout = document.getElementById('parkingLayout');
    const videoFeed = document.getElementById('live');
    const viewToggle = document.getElementById('viewtoggle');

    // Function to hide all sections
    function hideAllSections() {
        homeSection.style.display = 'none';
        setupSection.style.display = 'none';
        historySection.style.display = 'none';
        gateViewSection.style.display = 'none';
    }

    // Function to hide parking layout and video
    function hideParkingLayoutAndVideo() {
        parkingLayout.style.display = 'none';
        videoFeed.style.display = 'none';
    }

    // Function to toggle views and update button text
    

    function toggleView() {
        if (viewToggle.checked) {
            // If the checkbox is checked, show the video feed and hide the parking layout
            parkingLayout.style.display = 'none';
            videoFeed.style.display = 'block';
        } else {
            // If the checkbox is not checked, show the parking layout and hide the video feed
            parkingLayout.style.display = 'block';
            videoFeed.style.display = 'none';
        }
    }

    // Add click event listeners
    homeMenu.addEventListener('click', () => {
        hideAllSections();
        hideParkingLayoutAndVideo();
        homeSection.style.display = 'block';
        parkingLayout.style.display = 'block'; // Show parking layout by default on home
        setActiveMenuItem(homeMenu);
    });

    setupMenu.addEventListener('click', () => {
        hideAllSections();
        hideParkingLayoutAndVideo();
        setupSection.style.display = 'block';
        setActiveMenuItem(setupMenu);
    });

    historyMenu.addEventListener('click', () => {
        hideAllSections();
        hideParkingLayoutAndVideo();
        historySection.style.display = 'block';
        setActiveMenuItem(historyMenu);
    });

    gateViewMenu.addEventListener('click', () => {
        hideAllSections();
        hideParkingLayoutAndVideo();
        gateViewSection.style.display = 'block';
         // Call toggleView to handle toggle behavior on gate view
        setActiveMenuItem(gateViewMenu);
    });

    // Initially hide all sections except home
    setActiveMenuItem(homeMenu);
    hideAllSections();
    homeSection.style.display = 'block';
    parkingLayout.style.display = 'block'; // Show parking layout by default on home

    // Initially set to show the layout and offer to switch to the camera
    parkingLayout.style.display = 'block';
    videoFeed.style.display = 'none';
    viewToggle.textContent = 'Switch to Camera';

    // Add event listener to toggle views on button click
    viewToggle.addEventListener('click', toggleView);

     function setActiveMenuItem(menuItem) {
        const menuItems = [homeMenu, setupMenu, historyMenu, gateViewMenu];
        menuItems.forEach(item => {
            if (item === menuItem) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
});

// sidebar position and width adusting ;

const bar= document.getElementById('bar2');
const sidebar=document.getElementById('sidebar-id');
  
    bar.onclick=function(){
        sidebar.classList.toggle("active")
    }

    // upper div for visualization
    const totalSpaces = 100;
    const availableSpaces = 45;
    
    const ctx = document.getElementById('myChart').getContext('2d');
    
    const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [availableSpaces, totalSpaces - availableSpaces],
                backgroundColor: ['#00ff00','rgb(211,211,211)' ],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '80%',  // Adjusts the size of the inner hole
            plugins: {
                legend: { display: true },
                tooltip: { enabled: true },
            },
            responsive: false,
            maintainAspectRatio: false,
        },
        plugins: [{
            beforeDraw: function(chart) {
                const width = chart.width,
                    height = chart.height,
                    ctx = chart.ctx;
                ctx.restore();
                const fontSize = (height / 5.2).toFixed(2); // Adjust the divisor to change the font size
            ctx.font = `${fontSize}px Arial`;
                ctx.fillStyle = 'rgb(255,255,255)'; 
                ctx.textBaseline = "middle";
    
                const text = `${availableSpaces}/${totalSpaces}`,
                    textX = Math.round((width - ctx.measureText(text).width) / 2),
                    textY = height / 2;
    
                ctx.fillText(text, textX, textY);
                ctx.save();
            }
        }]
    });

    
    const ctx1 = document.getElementById('myChart2').getContext('2d');
    
    const myChart2 = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [availableSpaces, totalSpaces - availableSpaces],
                backgroundColor: ['rgb(211,211,211)','rgb(209, 34, 34)' ],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '80%',  // Adjusts the size of the inner hole
            plugins: {
                legend: { display: true },
                tooltip: { enabled: true },
            },
            responsive: false,
            maintainAspectRatio: false,
        },
        plugins: [{
            beforeDraw: function(chart) {
                const width = chart.width,
                    height = chart.height,
                    ctx1 = chart.ctx;
                ctx1.restore();
                const fontSize = (height / 5.2).toFixed(2); // Adjust the divisor to change the font size
            ctx1.font = `${fontSize}px Arial`;
                ctx1.fillStyle = 'rgb(255,255,255)'; 
                ctx1.textBaseline = "middle";
    
                const text = `${totalSpaces - availableSpaces}/${totalSpaces}`,
                    textX = Math.round((width - ctx1.measureText(text).width) / 2),
                    textY = height / 2;
    
                ctx1.fillText(text, textX, textY);
                ctx1.save();
            }
        }]
    });
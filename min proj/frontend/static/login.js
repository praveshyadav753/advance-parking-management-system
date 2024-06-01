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


//=================================================================================
// Get the video element

document.addEventListener('DOMContentLoaded', function() {
    const videoElement = document.getElementById('entry');
    videoElement.src = "/entry-gate";
});




//...................................x.........x............x.........x...........x............x.........x...........x


// /////////////////////////////////////////////
// document.addEventListener('DOMContentLoaded', () => {
//     const sections = {
//         home: document.getElementById('above-parking'),
//         setup: document.getElementById('setup1'), // Updated to match your setup section ID
//         history: document.getElementById('history1') // Assuming you add a section with id="history"
//     };

//     // Function to hide all sections
//     const hideAllSections = () => {
//         Object.values(sections).forEach(section => {
//             if (section) section.style.display = 'none';
//         });
//     };

//     // Initially hide all and show home
//     hideAllSections();
//     if (sections.home) sections.home.style.display = 'block';

//     // Setup navigation links
//     const links = document.querySelectorAll('.menu ul li a');
//     links.forEach(link => {
//         link.addEventListener('click', (event) => {
//             event.preventDefault();
//             const selectedSection = sections[link.id];
//             if (selectedSection) {
//                 hideAllSections();
//                 selectedSection.style.display = 'block';

//                 // Update active class for links
//                 links.forEach(lnk => lnk.classList.remove('active'));
//                 link.classList.add('active');
//             }
//         });
//     });

//     // Set 'home' as the default active link
//     const homeLink = document.getElementById('home');
//     if (homeLink) homeLink.classList.add('active');
// });


// document.addEventListener('DOMContentLoaded', function() {
//     const viewToggle = document.getElementById('viewToggle');
//     const parkingLayout = document.getElementById('parkingLayout');
//     const live = document.getElementById('live');

//     // Function to toggle views and update button text
//     function toggleView() {
//         if (parkingLayout.style.display === 'none') {
//             // If the layout is hidden, show it and update the button to offer switching to the camera
//             parkingLayout.style.display = 'block';
//             live.style.display = 'none';
//             viewToggle.textContent = 'Switch to Camera';
//         } else {
//             // If the camera is hidden, show it and update the button to offer switching to the layout
//             parkingLayout.style.display = 'none';
//             live.style.display = 'block';
//             viewToggle.textContent = 'Switch to Layout';
//         }
//     }

//     // Initially set to show the layout and offer to switch to the camera
//     parkingLayout.style.display = 'block';
//     live.style.display = 'none';
//     viewToggle.textContent = 'Switch to Camera';

//     // Add event listener to toggle views on button click
//     viewToggle.addEventListener('click', toggleView);
// });









// //------------------------------------------------------------------------------------------------------------------------------
  
// // Show the profile edit container
function showProfileEditContainer() {
    var profileEditContainer = document.getElementById('editProfileContainer');
    profileEditContainer.classList.add('visible');
}

// Function to preview selected image after choosing a file
function previewImage(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
        var dataURL = reader.result;
        var output = document.getElementById('profilePic');
        output.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
}

// Function to trigger file input when the specific change profile photo button is clicked
function updateProfilePhoto(event) {
    event.stopPropagation(); // Stop the event propagation
    document.getElementById('fileInput').click();
}

// Function to delete profile photo and set it to default
function deleteProfilePhoto() {
    var defaultProfilePic = "user.jpg"; // Path to your default profile picture
    var profilePic = document.getElementById('profilePic');
    profilePic.src = defaultProfilePic;
    // Add logic here for server-side deletion if necessary
}

// Additional logic to hide the profile edit container when clicking outside the sidebar profile picture
document.addEventListener('click', function(event) {
    var editProfileContainer = document.getElementById('editProfileContainer');
    var sidebarProfilePic = document.getElementById('sidebarProfilePic');
    var isClickInsideSidebarProfilePic = sidebarProfilePic.contains(event.target);

    
});

// Ensure you call showProfileEditContainer() only when necessary, perhaps when clicking a specific edit button

document.addEventListener('DOMContentLoaded', function() {
    // Function to toggle the visibility of the edit profile container
    document.getElementById('sidebarProfilePic').addEventListener('click', function() {
        var editProfileContainer = document.getElementById('editProfileContainer');
        editProfileContainer.classList.toggle('visible');
    });

    // Function to hide the edit profile container if clicked outside of it
    document.addEventListener('click', function(event) {
        var editProfileContainer = document.getElementById('editProfileContainer');
        var sidebarProfilePic = document.getElementById('sidebarProfilePic');

        // Checking if the click is outside the edit profile container and not on the sidebar profile pic
        if (!editProfileContainer.contains(event.target) && !sidebarProfilePic.contains(event.target) && editProfileContainer.classList.contains('visible')) {
            editProfileContainer.classList.remove('visible');
        }
    });

    // Stop propagation to prevent the document click from hiding the container when clicking inside it
    document.getElementById('editProfileContainer').addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // Function to preview and change the profile photo
    window.previewImage = function(event) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var profilePic = document.getElementById('profilePic');
            profilePic.src = e.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    // Function to change the profile photo by clicking the Change Photo button
    window.updateProfilePhoto = function(event) {
        event.stopPropagation(); // Prevent the click from closing the edit profile container
        document.getElementById('fileInput').click();
    };

    // Function to delete the profile photo and revert it to a default one
    window.deleteProfilePhoto = function() {
        var defaultProfilePic = "user.jpg"; // Adjust the path to your default image
        var profilePic = document.getElementById('profilePic');
        profilePic.src = defaultProfilePic;
    };
});















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
    const viewToggle = document.getElementById('viewToggle');

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
        if (parkingLayout.style.display === 'none') {
            // If the layout is hidden, show it and update the button to offer switching to the camera
            parkingLayout.style.display = 'block';
            videoFeed.style.display = 'none';
            viewToggle.textContent = 'Switch to Camera';
        } else {
            // If the camera is hidden, show it and update the button to offer switching to the layout
            parkingLayout.style.display = 'none';
            videoFeed.style.display = 'block';
            viewToggle.textContent = 'Switch to Layout';
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

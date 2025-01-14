document.addEventListener('DOMContentLoaded', function() {

    const menuItems = document.querySelectorAll('.menu-profile .io a');
    const sections = {
        'Account': document.querySelector('.account'),
        'Password': document.querySelector('.pass-profile'),
        'Security': document.querySelector('.security')
    };

    // Initially hide all sections except the Account section
    for (const section of Object.values(sections)) {
        section.style.display = 'none';
    }
    sections['Account'].style.display = 'block'; // Show default section

    // Add click event listeners to menu items
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the default link behavior
            const sectionName = this.textContent.trim(); // Get the section name
            if (sections[sectionName]) {
                // Hide all sections
                for (const section of Object.values(sections)) {
                    section.style.display = 'none';
                }
                // Show the clicked section
                sections[sectionName].style.display = 'block';
            }
        });
    });
});
const profileImg = document.getElementById('profileImg');
        const dropdownMenu = document.getElementById('dropdownMenu');

        profileImg.addEventListener('click', () => {
            const isVisible = dropdownMenu.style.display === 'block';
            dropdownMenu.style.display = isVisible ? 'none' : 'block';
        });

        window.addEventListener('click', (event) => {
            if (!profileImg.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.style.display = 'none';
            }
        });
        document.getElementById('toggleProfile').addEventListener('click', () => {
            document.getElementById('profileOverlay').style.display = 'block';
                })
            

        document.addEventListener('click', event => {
            if (event.target && event.target.id === 'closeaccount') {
                document.getElementById('profileOverlay').style.display = 'none';
                document.getElementById('mainContent').classList.remove('faded');
            }
        });
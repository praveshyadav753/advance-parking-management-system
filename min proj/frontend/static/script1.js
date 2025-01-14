let parkingLayout = document.getElementById('parkingLayout'); // Cache the DOM element
let lastUpdated = 0; // Track last update time to reduce unnecessary updates

// Function to calculate scale factor
function determineScaleFactor(data, containerWidth, containerHeight) {
    const minX = Math.min(...data.flatMap(area => area.points.map(point => point[0])));
    const minY = Math.min(...data.flatMap(area => area.points.map(point => point[1])));
    const maxX = Math.max(...data.flatMap(area => area.points.map(point => point[0])));
    const maxY = Math.max(...data.flatMap(area => area.points.map(point => point[1])));

    return {
        x: containerWidth / (maxX - minX),
        y: containerHeight / (maxY - minY),
    };
}

// Function to update parking spots
async function updateParkingSpots() {
    try {
        const response = await fetch('/get_all_parking_areas');
        const data = await response.json();

        // If the data has not changed, do not re-render
        if (Date.now() - lastUpdated < 1000) return; // Avoid frequent updates

        lastUpdated = Date.now(); // Update the last updated timestamp

        const containerWidth = parkingLayout.offsetWidth;
        const containerHeight = parkingLayout.offsetHeight;
        const scaleFactor = determineScaleFactor(data, containerWidth, containerHeight);

        // Update or create parking area elements
        data.forEach(area => {
            const minX = Math.min(...area.points.map(point => point[0]));
            const minY = Math.min(...area.points.map(point => point[1]));
            const width = Math.max(...area.points.map(point => point[0])) - minX;
            const height = Math.max(...area.points.map(point => point[1])) - minY;

            const centerX = (minX + width / 2) * scaleFactor.x;
            const centerY = (minY + height / 2) * scaleFactor.y;

            const occupiedStatus = area.occupied ? 'static/red.svg' : 'static/green.svg';

            // Check if the area already exists in the DOM, otherwise create it
            let img = parkingLayout.querySelector(`#area-img-${area.id}`);
            if (!img) {
                img = document.createElement('img');
                img.id = `area-img-${area.id}`; // Assign unique ID for quick lookup
                img.className = 'car-svg';
                parkingLayout.appendChild(img);
            }
            img.src = occupiedStatus;

            const imgWidth = 50; // Width of the SVG image
            const imgHeight = 50; // Height of the SVG image
            img.style.left = `${(((centerX-55) - (imgWidth / 2)) / containerWidth) * 100}%`;
            img.style.top = `${(((centerY-90) - (imgHeight / 2)) / containerHeight) * 100}%`;

            // Update area number text
            let areaNumber = parkingLayout.querySelector(`#area-number-${area.id}`);
            if (!areaNumber) {
                areaNumber = document.createElement('div');
                areaNumber.id = `area-number-${area.id}`; // Unique ID for easy lookup
                areaNumber.className = 'area-number';
                parkingLayout.appendChild(areaNumber);
            }
            areaNumber.textContent = `A${area.id}`;
            areaNumber.style.left = `${(((centerX-60) + (imgWidth / 2) ) / containerWidth) * 100}%`;
            areaNumber.style.top = `${(((centerY-90) - (imgHeight / 2)) / containerHeight) * 100}%`;
        });
    } catch (error) {
        console.error('Error loading parking areas:', error);
    }
}

// Event listener to update parking spots on page load and at regular intervals
document.addEventListener('DOMContentLoaded', () => {
    updateParkingSpots(); // Initial update
    setInterval(updateParkingSpots, 5000); // Fetch data every 5 seconds
});

function determineScaleFactor(data, containerWidth, containerHeight) {
    // Initialize variables to track the minimum and maximum coordinates
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    // Loop through all parking areas to find the min and max coordinates
    data.forEach(area => {
        area.points.forEach(([x, y]) => {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        });
    });

    // Calculate the width and height of the parking area based on min/max coordinates
    const parkingWidth = (maxX) - minX;
    const parkingHeight = (maxY) - minY;

    // Calculate scale factors as the ratio of container dimensions to parking dimensions
    const scaleX = (containerWidth / parkingWidth)* 0.98;
    const scaleY = (containerHeight / parkingHeight)*0.98;

    // Return the smaller of the two scale factors to ensure the parking area fits within the container
    // while maintaining the aspect ratio (optional, depending on your needs)
    const uniformScale = Math.min(scaleX, scaleY);

    return { x: uniformScale, y: uniformScale };
}

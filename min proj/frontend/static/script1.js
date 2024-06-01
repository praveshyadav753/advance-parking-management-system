function updateParkingSpots() {
    fetch('/get_all_parking_areas') // Fetch data from the server endpoint
        .then(response => response.json())
        .then(data => {
            const parkingLayout = document.getElementById('parkingLayout');
            const containerWidth = parkingLayout.offsetWidth;
            const containerHeight = parkingLayout.offsetHeight;
            const scaleFactor = determineScaleFactor(data, containerWidth, containerHeight);
            parkingLayout.innerHTML = ''; // Clear existing content
            

            data.forEach(area => {
                const minX = Math.min(...area.points.map(point => point[0]));
                const minY = Math.min(...area.points.map(point => point[1]));
                const maxX = Math.max(...area.points.map(point => point[0]));
                const maxY = Math.max(...area.points.map(point => point[1]));
                const width = maxX - minX;
                const height = maxY - minY;

                const centerX = (minX + width / 2) * scaleFactor.x;
                const centerY = (minY + height / 2) * scaleFactor.y;

                // Determine the image source based on the occupied status
                const occupiedStatus = area.occupied ? 'static/red.svg' : 'static/green.svg';

                const img = document.createElement('img');
                img.src = occupiedStatus;
                img.className = 'car-svg';

                // Calculate image position relative to container size
                const imgWidth = 50; // Width of the SVG image
                const imgHeight = 50; // Height of the SVG image
                img.style.left = `${(((centerX-55) - (imgWidth / 2)) / containerWidth) * 100}%`;
                img.style.top = `${(((centerY-90) - (imgHeight / 2)) / containerHeight) * 100}%`;

                parkingLayout.appendChild(img);

                // Position the area number similarly
                const areaNumber = document.createElement('div');
                areaNumber.className = 'area-number';
                areaNumber.textContent = `A${area.id}`;
                areaNumber.style.left = `${(((centerX-60) + (imgWidth / 2) ) / containerWidth) * 100}%`;
                areaNumber.style.top = `${(((centerY-90) - (imgHeight / 2)) / containerHeight) * 100}%`;
                parkingLayout.appendChild(areaNumber);
            });
        })
        .catch(error => console.error('Error loading parking areas:', error));
}




// Event listener to update parking spots on page load and at regular intervals
document.addEventListener('DOMContentLoaded', () => {
    updateParkingSpots(); // Initial update
    setInterval(updateParkingSpots, 100); 
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

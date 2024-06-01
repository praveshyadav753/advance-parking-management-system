    document.addEventListener('DOMContentLoaded', function() {
        const canvas = document.getElementById('parkingCanvas');
        const ctx = canvas.getContext('2d');
        let mode = 'auto'; // Default mode
        let currentArea = [];
        const autoAreaSize = { width: 105, height: 45 };
        let areas = []; // Store defined areas from backend and new areas
        let availableIds = []; // Store available IDs from deleted areas

function generateNewAreaId() {
    if (availableIds.length > 0) {
        // Sort available IDs and take the smallest
        availableIds.sort((a, b) => a - b);
        return availableIds.shift(); // Removes and returns the first ID
    } else if (areas.length === 0) {
        return 1;
    } else {
        const highestId = Math.max(...areas.map(area => area.id));
        return highestId + 1;
    }
}

        function isPointInsidePolygon(point, polygon) {
            if (!Array.isArray(polygon) || polygon.length === 0) {
                return false;
            }
        
            var x = point[0], y = point[1];
            var inside = false;
            for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                var xi = polygon[i][0], yi = polygon[i][1];
                var xj = polygon[j][0], yj = polygon[j][1];
                var intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        }

        function markPoint(x, y) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        function drawArea(points, color) {
            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            points.forEach(([x, y], index) => {
                if (index > 0) ctx.lineTo(x, y);
            });
            ctx.closePath();
            ctx.strokeStyle = color;
            ctx.stroke();
        }

        fetch('/frame')
            .then(response => response.json())
            .then(data => {
                if (data.frame) {
                    const liveFrame = document.getElementById('liveFrame');
                    liveFrame.src = data.frame;
                    liveFrame.onload = function() {
                        canvas.width = liveFrame.offsetWidth;
                        canvas.height = liveFrame.offsetHeight;
                        fetch('/parking-areas')
                            .then(response => response.json())
                            .then(data => {
                                areas = data;
                                areas.forEach(area => {
                                    drawArea(area.points,'rgba(0, 0, 255, 1)');
                                });
                            })
                            .catch(error => console.error('Failed to load parking areas', error));
                    };
                } else {
                    console.error('Failed to load frame');
                }
            });

        document.getElementById('modeSelection').addEventListener('change', function(event) {
            mode = event.target.value;
            currentArea = [];
        });

        canvas.addEventListener('click', function(event) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            
            if (areas.some(area => isPointInsidePolygon([x, y], area.points))) {
                console.log("Click is inside an existing area. No new area will be defined.");
                return;
            }
            markPoint(x, y);

            if (mode === 'auto') {
                const points = [
                    [x, y],
                    [x + autoAreaSize.width, y],
                    [x + autoAreaSize.width, y + autoAreaSize.height],
                    [x, y + autoAreaSize.height],
                    [x, y]
                ];
                areas.push({id: generateNewAreaId(),points: points, occupied: false});
                drawArea(points, 'rgba(255, 255, 0, 0.8)');
            } else if (mode === 'manual') {
                currentArea.push([x, y]);

                if (currentArea.length ===1) {
                   // drawArea([...currentArea, currentArea[0]], 'rgba(255, 255, 0, 0.9)');
                }

                if (currentArea.length >= 4) {
                    currentArea.push(currentArea[0]);
                    areas.push({id: generateNewAreaId(),points: currentArea, occupied: false});
                    drawArea(currentArea, 'rgba(255, 255, 0, 0.9)');
                    areas.push(currentArea.slice(0, -1)); // Add the new area without the closing point to the areas array

                    currentArea = [];
                }
            }
        });

        document.getElementById('submitArea').addEventListener('click', function() {
            // Submit logic here
            console.log('Submit the defined area', areas);
            // Example: fetch('/api/submit-area', { method: 'POST', body: JSON.stringify({ areas: areas }), headers: { 'Content-Type': 'application/json' }});
        });
      });
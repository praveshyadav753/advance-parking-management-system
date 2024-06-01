// gate_view.js

// Connect to the Socket.IO server
const socket = io();

// Listen for the 'frame' event emitted by the server

socket.on('frame', (frameData) => {
    // Update the image source with the received frame data
    const gateViewImg = document.getElementById('gate-view');
    gateViewImg.src = 'data:image/jpeg;base64,' + frameData;
});

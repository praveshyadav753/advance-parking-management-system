// import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

// const socket = io('http://127.0.0.1:5001');

// // Elements
// const parkingDataContainer = document.getElementById('parking-data');
// const videostream = document.getElementById('video-stream'); // Ensure this element exists

// // Socket connection handling
// socket.on('connect', () => {
//     console.log('Connected to the server');
// });

// // Handle connection errors
// socket.on('connect_error', (err) => {
//     console.error('Connection error:', err);
// });

// // Handle disconnection
// socket.on('disconnect', () => {
//     console.warn('Disconnected from the server');
// });

// // Handling video stream frames from the server
// socket.on('frame', (data) => {
//     console.log('getting frames from video stream')
//     try {
//         if (data && data.frame) {
//             videostream.src = `data:image/jpeg;base64,${data.frame}`;
//         } else {
//             console.error('Invalid frame data received:', data);
//         }
//     } catch (error) {
//         console.error('Error updating video stream:', error);
//     }
// });

// // Additional error handling for other events
// socket.on('error', (err) => {
//     console.error('Socket error:', err);
// });

 import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";


const socket = io('http://127.0.0.1:5001'); // Connect to the Flask Socket.IO server
        const videoStream = document.getElementById('video-stream');

        socket.on('connect', () => {
            console.log('Connected to the server');
        });

        socket.on('frame', (data) => {
            console.log(data.frame);
            videoStream.src = `data:image/jpeg;base64,${data.frame}`;

            
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from the server');
        });
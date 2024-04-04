import { io, Socket } from 'socket.io-client';

const socketUrl = 'http://localhost:3000'; // Change this to your socket server URL
const eventName = 'keywords_scraped_succeed'; // Change this to the event name you want to listen to

// Connect to the socket server
const socket: Socket = io(socketUrl);

// Listen for the specified event
socket.on(eventName, (data: any) => {
    console.log(`Received data from ${eventName}:`, data);
});

// Optional: Handle connection and disconnection events
socket.on('connect', () => {
    console.log('Connected to socket server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
});

// Optional: Handle errors
socket.on('error', (error: Error) => {
    console.error('Socket error:', error);
});

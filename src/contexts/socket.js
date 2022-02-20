import React from 'react';
import socketio from 'socket.io-client';

const SERVER_URL = '';
export const socket = socketio.connect(SERVER_URL);
export const SocketContext = React.createContext();
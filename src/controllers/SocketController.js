// src/controllers/socketController.js
import { Server } from 'socket.io';
import { SocketService } from '../services/socketService.js';

export class SocketController {
  constructor(server) {
    const io = new Server(server);
    this.socketService = new SocketService(io);
  }
}
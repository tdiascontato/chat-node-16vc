// src/services/socketService.js
export class SocketService {
    constructor(io) {
      this.io = io;
      this.setupSocketEvents();
    }
  
    setupSocketEvents() {
      this.io.on('connection', (socket) => {
        console.log('Um usuário conectou');
  
        socket.on('chat message', (msg) => {
          this.handleChatMessage(msg);
        });
  
        socket.on('disconnect', () => {
          this.handleDisconnect();
        });
      });
    }
  
    handleChatMessage(msg) {
      console.log('Mensagem recebida:', msg);
      this.io.emit('chat message', msg);
    }
  
    handleDisconnect() {
      console.log('Usuário desconectou');
    }
}
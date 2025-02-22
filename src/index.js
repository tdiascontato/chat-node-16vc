import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import prisma from './prisma.js';
import userRouter from './routes/userRoute.js';
import conversationRouter from './routes/conversationRoute.js';
import messageRouter from './routes/messageRoute.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.set('io', io);

app.use('/api/users', userRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/messages', messageRouter);

io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  socket.on('joinConversation', async ({ conversationId, userId }) => {
    try {
      const conversation = await prisma.conversation.findUnique({
        where: { id: parseInt(conversationId) },
        include: { user: true }
      });

      if (conversation && conversation.user.uid === userId) {
        socket.join(conversationId);
        socket.emit('connected', { status: 'Conectado à conversa' });
      }
    } catch (error) {
      console.error('Erro na conexão:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  prisma.$connect().then(() => console.log('Conectado ao banco de dados'));
});
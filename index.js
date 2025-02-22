// src/index.js
import express from 'express';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import userRouter from './src/routes/userRoute.js';
// import { SocketController } from './controllers/SocketController.js';

const app = express();
const server = createServer(app);

app.use(bodyParser.json());
app.use('/users', userRouter);

// new SocketController(server);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
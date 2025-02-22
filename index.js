import bodyParser from "body-parser";
import { createServer } from "node:http";
// src/index.js
import express from "express";
import conversationRouter from "./src/routes/conversationRoute.js";
import userRouter from "./src/routes/userRoute.js";
// import { SocketController } from './controllers/SocketController.js';

const app = express();
const server = createServer(app);

app.use(bodyParser.json());
app.use("/api/users", userRouter);
app.use("/api/conversations", conversationRouter);

// new SocketController(server);

const PORT = 3000;
server.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});

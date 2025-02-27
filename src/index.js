import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import prisma from "./prisma.js";
import conversationRouter from "./routes/conversationRoute.js";
import messageRouter from "./routes/messageRoute.js";
import userRouter from "./routes/userRoute.js";

const app = express();
const server = createServer(app);

app.use(
	cors({
		origin: ["http://localhost:3000", "http://127.0.0.1:5500"], // Altere para seus domínios
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000", "http://127.0.0.1:5500"], // Mesmos domínios do Express
		methods: ["GET", "POST"],
		credentials: true,
	},
});
// origin: '*'

app.use(bodyParser.json());
app.set("io", io);

app.use("/api/users", userRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);

io.on("connection", (socket) => {
	console.log("Novo cliente conectado");

	socket.on("joinConversation", async ({ conversationId, userId }) => {
		try {
			const conversation = await prisma.conversation.findUnique({
				where: { id: conversationId },
				include: { user: true },
			});

			if (conversation && conversation.user.id === userId) {
				socket.join(conversationId);
				socket.emit("connected", { status: "Conectado à conversa" });
			}
		} catch (error) {
			console.error("Erro na conexão:", error);
		}
	});

	socket.on("leaveConversation", (conversationId) => {
		socket.leave(conversationId.toString());
		console.log(`Cliente saiu da conversa ${conversationId}`);
	});

	socket.on("disconnect", () => {
		console.log("Cliente desconectado");
	});
});

const PORT = 4000;
server.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
	prisma.$connect().then(() => console.log("Conectado ao banco de dados"));
});

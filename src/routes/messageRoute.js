import { Router } from "express";
import prisma from "../prisma.js";
import { OpenAiService } from "../services/openAiService.js";

const router = Router();

router.post("/", async (req, res) => {
	try {
		const { conversation_id, sender_id, message, is_ai } = req.body;
		const io = req.app.get("io");
		let newMessage = {};

		if (!is_ai) {
			newMessage = await prisma.message.create({
				data: {
					text: message,
					sender: { connect: { uid: sender_id } },
					conversation: { connect: { id: Number.parseInt(conversation_id) } },
				},
				include: { sender: true },
			});
		} else {
			const ai = new OpenAiService();
			const threadId = await ai.createThread();

			const aiMessage = await ai.sendMessage(threadId, message);

			newMessage.sender.uid = null;
			newMessage.text = aiMessage;
			newMessage.createdAt = new Date();
		}

		io.to(conversation_id).emit("newMessage", {
			sender_id: newMessage.sender.uid,
			message: newMessage.text,
			timestamp: newMessage.createdAt,
		});

		res.json({
			message_id: newMessage.id,
			message: newMessage.text,
			timestamp: newMessage.createdAt,
		});
	} catch (error) {
		res.status(500).json({ error: "Erro ao enviar mensagem" });
	}
});

export default router;

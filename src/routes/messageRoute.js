import { Router } from "express";
import prisma from "../prisma.js";
import { OpenAiService } from "../services/openAiService.js";

const router = Router();

router.post("/", async (req, res) => {
	try {
		const { conversation_id, user_id, sender_id, message, is_ai } = req.body;
		const io = req.app.get("io");
		let newMessage = {};

		if (!is_ai) {
			newMessage = await prisma.message.create({
				data: {
					text: message,
					sender: { connect: { uid: sender_id } },
					conversation: {
						connectOrCreate: {
							where: { id: Number.parseInt(conversation_id) },
							create: {
								isAi: false,
								user: { connect: { uid: user_id } },
								createdAt: new Date(),
							},
						},
					},
				},
				include: { sender: true, conversation: true },
			});
		} else {
			const ai = new OpenAiService();
			const threadId = await ai.createThread();

			const aiMessage = await ai.sendMessage(threadId, message);

			newMessage.sender.uid = null;
			newMessage.text = aiMessage;
			newMessage.createdAt = new Date();
		}

		io.to(newMessage.conversation.id).emit("newMessage", {
			sender_id: newMessage.sender.uid,
			message: newMessage.text,
			timestamp: newMessage.createdAt,
		});

		res.json({
			conversation_id: newMessage.conversation.id,
			message_id: newMessage.id,
			message: newMessage.text,
			timestamp: newMessage.createdAt,
		});
	} catch (error) {
		res.status(500).json({ error: "Erro ao enviar mensagem" });
	}
});

export default router;

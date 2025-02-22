import { Router } from "express";
import { randomUUID } from "node:crypto";
import prisma from "../prisma.js";
import { OpenAiService } from "../services/openAiService.js";

const router = Router();

router.post("/", async (req, res) => {
	try {
		console.log(req.body);
		const { conversation_id, user_id, sender_id, message, is_ai } = req.body;
		let newMessage = {};

		if (!is_ai) {
			newMessage = await prisma.message.create({
				data: {
					text: message,
					sender: { connect: { id: sender_id } },
					conversation: {
						connectOrCreate: {
							where: { id: conversation_id },
							create: {
								id: randomUUID(),
								isAi: false,
								user: { connect: { id: user_id } },
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

			console.log({ aiMessage });

			const convers = await prisma.conversation.create({
				data: {
					id: randomUUID(),
					isAi: true,
					user: { connect: { id: user_id } },
				},
			});

			newMessage.conversation = { id: convers.id };
			newMessage.text = aiMessage;
			newMessage.createdAt = new Date();
		}

		res.json({
			conversation_id: newMessage.conversation.id,
			message_id: newMessage.id,
			message: newMessage.text,
			timestamp: newMessage.createdAt,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Erro ao enviar mensagem" });
	}
});

export default router;

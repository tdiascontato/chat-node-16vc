import "dotenv/config";
import { OpenAI } from "openai";

export class OpenAiService {
	constructor() {
		this.openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});
		this.assistantId = process.env.OPENAI_ASSISTANT_ID;
	}

	async createThread() {
		try {
			const thread = await this.openai.beta.threads.create();
			return thread.id;
		} catch (error) {
			console.error("Erro ao criar thread:", error);
			throw new Error("Falha ao criar thread");
		}
	}

	async #addMessage(threadId, userMessage) {
		try {
			await this.openai.beta.threads.messages.create(threadId, {
				role: "user",
				content: userMessage,
			});
		} catch (error) {
			console.error("Erro ao adicionar mensagem ao thread:", error);
			throw new Error("Falha ao adicionar mensagem");
		}
	}

	async #runAssistant(threadId) {
		try {
			const run = await this.openai.beta.threads.runs.create(threadId, {
				assistant_id: this.assistantId,
			});

			let status = run.status;
			while (status === "in_progress" || status === "queued") {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				const updatedRun = await this.openai.beta.threads.runs.retrieve(
					threadId,
					run.id,
				);
				status = updatedRun.status;
			}

			if (status !== "completed") {
				throw new Error(`Falha ao processar a resposta (Status: ${status})`);
			}

			const messages = await this.openai.beta.threads.messages.list(threadId);
			const lastMessage = messages.data[0];
			return lastMessage.content[0].text.value;
		} catch (error) {
			console.error("Erro ao rodar assistant:", error);
			throw new Error("Falha ao rodar a assistant");
		}
	}

	async sendMessage(threadId, userMessage) {
		try {
			await this.#addMessage(threadId, userMessage);
			return await this.#runAssistant(threadId);
		} catch (error) {
			console.error("Erro no sendMessage:", error);
			throw new Error("Falha ao enviar mensagem");
		}
	}
}

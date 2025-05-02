import { Groq } from 'groq-sdk';

const groq = new Groq();
async function main(message: string) {
	const chatCompletion = await groq.chat.completions.create({
		messages: message,
		model: 'llama-3.3-70b-versatile',
		temperature: 1,
		max_completion_tokens: 1024,
		top_p: 1,
		stream: true,
		stop: null
	});

	for await (const chunk of chatCompletion) {
		process.stdout.write(chunk.choices[0]?.delta?.content || '');
	}
}

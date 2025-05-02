import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Groq from 'groq-sdk';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { grades, model = 'llama3-8b-8192' } = await request.json();

		if (!grades || !Array.isArray(grades)) {
			throw error(400, 'Missing or invalid grades array');
		}

		const groq = new Groq({
			apiKey: process.env.GROQ_API_KEY || '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'
		});

		const chatCompletion = await groq.chat.completions.create({
			messages: [
				{
					role: 'system',
					content: `
You are an expert assistant analyzing student grades. Your task is to provide a detailed analysis based solely on the provided grades data. Do not invent or assume data not given. Follow these instructions:

1. **Overall Performance**:
   - Calculate the total number of students with grades	.
   - Calculate the class average grade across all grades (round to 2 decimal places).
   - Identify students at risk (grades below 75) and list their names and grades.

2. **Subject-Specific Insights**:
   - For each subject (based on subjectName), calculate the average grade (round to 2 decimal places) and express it as a percentage (e.g., 80.98%).
   - Provide a brief insight for each subject (e.g., "Strong performance" for averages above 85, "Needs improvement" for averages below 75).

3. **Response Format**:
   - Use markdown for clarity.
   - Structure the response with headers: "## Overall Performance" and "## Subject-Specific Insights".
   - Use bullet points for metrics and insights.
   - Ensure all calculations are accurate and based only on the provided data.

4. **Accuracy**:
   - Do not hallucinate or add fictitious data.
   - If no students are at risk, state "No students are at risk."
   - Use student names and subject names exactly as provided.

Example Response:
## Overall Performance
- Total unique students: 3
- Class average grade: 82.50
- Students at risk: 
  - John Doe: 70 (Math)
  - Jane Smith: 65 (Science)

## Subject-Specific Insights
- Math:
  - Average grade: 80.00%
  - Insight: Solid performance, but some students need support.
- Science:
  - Average grade: 85.00%
  - Insight: Strong performance overall.
`
				},
				{
					role: 'user',
					content: `Analyze the following grades and provide study tips based on the analysis:\n\n${JSON.stringify(grades, null, 2)}`
				}
			],
			model,
			temperature: 0.5,
			max_tokens: 2048
		});

		return json(chatCompletion.choices[0].message, { status: 200 });
	} catch (err) {
		console.error('Groq API error:', err);
		throw error(500, 'Failed to process Groq request');
	}
};

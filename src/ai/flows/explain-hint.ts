
'use server';
/**
 * @fileOverview Provides AI-powered hints for the journey stations.
 *
 * - explainHint - A function that generates a detailed explanation for a given station.
 * - ExplainHintInput - The input type for the explainHint function.
 * - ExplainHintOutput - The return type for the explainHint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit/zod';

export const ExplainHintInputSchema = z.object({
  stationName: z.string().describe('The name of the station the user is currently on.'),
  passionName: z.string().describe('The name of the passion the user is currently exploring.'),
  stationDescription: z.string().describe('The description of the current station.'),
  language: z.enum(['en', 'ar']).describe('The language for the response.'),
});
export type ExplainHintInput = z.infer<typeof ExplainHintInputSchema>;

export const ExplainHintOutputSchema = z.string().describe('A detailed, helpful explanation and guiding questions for the user.');
export type ExplainHintOutput = z.infer<typeof ExplainHintOutputSchema>;


export async function explainHint(input: ExplainHintInput): Promise<ExplainHintOutput> {
    return explainHintFlow(input);
}

const explainHintFlow = ai.defineFlow(
  {
    name: 'explainHintFlow',
    inputSchema: ExplainHintInputSchema,
    outputSchema: ExplainHintOutputSchema,
  },
  async (input) => {
    const prompt = `
        You are a helpful and encouraging career and passion coach.
        The user is on a journey to discover their passion. They are at the "${input.stationName}" station for their passion "${input.passionName}".
        The goal of this station is: "${input.stationDescription}".
        The user has asked for help. Your task is to provide a detailed, encouraging, and thought-provoking explanation in ${input.language === 'ar' ? 'Arabic' : 'English'}.
        
        Your response should:
        1.  Start with an encouraging sentence.
        2.  Briefly re-explain the purpose of this station in simple terms.
        3.  Provide 2-3 guiding questions to help the user think more deeply and come up with good answers. The questions should be practical and insightful.
        4.  End with a motivational closing statement.

        Keep the tone friendly, positive, and supportive.
        Do not output markdown or any special formatting. Just plain text.
    `;

    const llmResponse = await ai.generate({
        prompt: prompt,
        model: 'gemini-1.5-flash-latest',
        config: {
            temperature: 0.8,
        },
    });

    return llmResponse.text;
  }
);

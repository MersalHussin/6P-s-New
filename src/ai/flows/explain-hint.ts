'use server';

/**
 * @fileOverview Explains a hint in the context of a user's passion.
 *
 * - explainHint - A function that provides a detailed explanation for a given hint.
 * - ExplainHintInput - The input type for the function.
 * - ExplainHintOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExplainHintInputSchema = z.object({
  passionName: z.string().describe('The name of the passion the user is currently exploring.'),
  hint: z.string().describe('The hint text that needs explanation.'),
  stationName: z.string().describe('The name of the station (e.g., Purpose, Power).'),
  language: z.enum(['ar', 'en']).describe('The language for the explanation.'),
});
export type ExplainHintInput = z.infer<typeof ExplainHintInputSchema>;

const ExplainHintOutputSchema = z.object({
  explanation: z.string().describe('A detailed, helpful explanation of the hint tailored to the user\'s passion in the specified language.'),
});
export type ExplainHintOutput = z.infer<typeof ExplainHintOutputSchema>;


export async function explainHint(
  input: ExplainHintInput
): Promise<ExplainHintOutput> {
  return explainHintFlow(input);
}


const explainPrompt = ai.definePrompt({
  name: 'explainHintPrompt',
  input: { schema: ExplainHintInputSchema },
  output: { schema: ExplainHintOutputSchema },
  prompt: `
  You are a helpful and encouraging career coach. Your goal is to help a user explore their passions more deeply.

  The user is currently in the "{{stationName}}" station of their passion discovery journey.
  Their current passion is: "{{passionName}}".
  The hint they need help with is: "{{hint}}".

  Your task is to provide a clear, detailed, and inspiring explanation of the hint in the context of their specific passion.
  Break down the hint and give them concrete examples or thought-provoking questions related to their passion "{{passionName}}".
  The response must be in {{language}}.

  Example structure for your response:
  1.  Start by re-stating the hint's core idea in a simple way.
  2.  Connect this idea directly to their passion, "{{passionName}}".
  3.  Provide 2-3 specific, actionable questions or examples to get them thinking.
  4.  End with an encouraging sentence.

  Keep the tone positive and empowering.
  `,
});

const explainHintFlow = ai.defineFlow(
  {
    name: 'explainHintFlow',
    inputSchema: ExplainHintInputSchema,
    outputSchema: ExplainHintOutputSchema,
  },
  async (input) => {
    const { output } = await explainPrompt(input);
    return output!;
  }
);

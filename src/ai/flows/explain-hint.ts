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
  hints: z.array(z.string()).describe('A list of hint texts that need explanation.'),
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

  The core ideas they need help with are encapsulated in these hints:
  {{#each hints}}
  - "{{this}}"
  {{/each}}

  Your task is to provide a clear, simple, and inspiring explanation that combines the ideas from ALL the hints provided, in the context of their specific passion.
  Do not just list the hints. Synthesize them into a single, cohesive piece of advice.
  Give them concrete examples or thought-provoking questions related to their passion "{{passionName}}" that stem from the combined meaning of the hints.
  
  The response must be in the language code: {{language}}.
  If the language is 'ar', you MUST respond in colloquial Egyptian Arabic (اللهجة المصرية العامية) to be more relatable to a younger audience.

  Example structure for your response (if the hints are about finding purpose):
  1.  Start by summarizing the core idea in a simple way (e.g., "The idea here is to connect your passion with a bigger goal...").
  2.  Connect this idea directly to their passion, "{{passionName}}".
  3.  Provide 2-3 specific, actionable questions or examples to get them thinking. (e.g., "Ask yourself, how can my love for '{{passionName}}' help someone else? Or what problem in the world can it solve?").
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
    const { output } = await explainPrompt(input, { model: 'googleai/gemini-1.5-flash-latest' });
    return output!;
  }
);

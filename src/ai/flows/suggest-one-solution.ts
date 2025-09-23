'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting a solution to a single problem.
 *
 * - suggestOneSolution - A function that handles the suggestion generation process.
 * - SuggestOneSolutionInput - The input type for the function.
 * - SuggestOneSolutionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOneSolutionInputSchema = z.object({
  problem: z.string().describe('A single problem the user is facing with their passion.'),
  passionName: z.string().describe('The name of the passion the problem is related to.'),
  language: z.enum(['ar', 'en']).describe('The language for the explanation.'),
});
export type SuggestOneSolutionInput = z.infer<
  typeof SuggestOneSolutionInputSchema
>;

const SuggestOneSolutionOutputSchema = z.object({
  solution: z.string().describe('A practical, actionable suggested solution for the problem.'),
});
export type SuggestOneSolutionOutput = z.infer<
  typeof SuggestOneSolutionOutputSchema
>;

export async function suggestOneSolution(
  input: SuggestOneSolutionInput
): Promise<SuggestOneSolutionOutput> {
  return suggestOneSolutionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOneSolutionPrompt',
  input: {schema: SuggestOneSolutionInputSchema},
  output: {schema: SuggestOneSolutionOutputSchema},
  prompt: `You are a creative and practical problem-solving assistant for a career coach.
  A user is exploring their passion for "{{passionName}}" and is stuck on a specific problem.

  Your task is to provide one concise, actionable, and encouraging solution to the following problem.
  The solution should be a single clear step they can take.

  The user's problem is: "{{problem}}"

  The response must be in the language code: {{language}}.
  If the language is 'ar', you MUST respond in colloquial Egyptian Arabic (اللهجة المصرية العامية).

  Example (if problem is "I don't have enough time"):
  - English solution: "Try to block out just 30 minutes on your calendar twice a week dedicated only to this passion. Starting small is better than not starting at all."
  - Arabic solution: "جرّب تخصص ٣٠ دقيقة بس في جدولك مرتين في الأسبوع للشغف ده. البداية الصغيرة أحسن من مفيش."

  Provide only the solution text.
  `,
});

const suggestOneSolutionFlow = ai.defineFlow(
  {
    name: 'suggestOneSolutionFlow',
    inputSchema: SuggestOneSolutionInputSchema,
    outputSchema: SuggestOneSolutionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';

/**
 * @fileOverview Ranks passions based on user inputs in the 6Ps framework using GenAI.
 *
 * - rankPassions - A function that ranks passions based on user inputs.
 * - RankPassionsInput - The input type for the rankPassions function.
 * - RankPassionsOutput - The return type for the rankPassions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PassionDetailsSchema = z.object({
  passion: z.string().describe('The name of the passion.'),
  purpose: z.array(z.string()).describe('The purposes for this passion.'),
  power: z.array(z.string()).describe('The strengths associated with this passion.'),
  proof: z.array(z.string()).describe('Evidence or demonstrations of this passion.'),
  problems: z.array(z.string()).describe('Problems or difficulties faced in this passion.'),
  possibilities: z.array(z.string()).describe('Potential outcomes or solutions for this passion.'),
  purposeWeights: z.array(z.enum(['high', 'medium', 'low'])).describe('Weights assigned to each purpose (high, medium, low).'),
});

export const RankPassionsInputSchema = z.object({
  passions: z.array(PassionDetailsSchema).describe('An array of passions with their details.'),
});
export type RankPassionsInput = z.infer<typeof RankPassionsInputSchema>;

const RankedPassionSchema = z.object({
  passion: z.string().describe('The name of the passion.'),
  score: z.number().describe('The calculated score for the passion.'),
  reasoning: z.string().describe('Explanation of the score.'),
});

export const RankPassionsOutputSchema = z.object({
  rankedPassions: z.array(RankedPassionSchema).describe('An array of passions ranked by their calculated scores.'),
});
export type RankPassionsOutput = z.infer<typeof RankPassionsOutputSchema>;


export async function rankPassions(input: RankPassionsInput): Promise<RankPassionsOutput> {
  return rankPassionsFlow(input);
}

const rankPassionsPrompt = ai.definePrompt({
  name: 'rankPassionsPrompt',
  input: {schema: RankPassionsInputSchema},
  output: {schema: RankPassionsOutputSchema},
  prompt: `You are an expert career coach helping young adults discover their passions.

  You will receive a list of passions with details provided by the user. Rank these passions based on the user's input in each category (Purpose, Power, Proof, Problems, Possibilities).

  Consider "Problems" as detractors, negatively impacting the overall score. Use the weights (high: 6, medium: 4, low: 2) provided for purpose statements to calculate a score for each passion.

  Return the passions ranked by their calculated scores along with a brief explanation of why each passion received that score.

  Here are the passions with their details:
  {{#each passions}}
    Passion: {{this.passion}}
    Purposes: {{this.purpose}}
    Purpose Weights: {{this.purposeWeights}}
    Power: {{#each this.power}} - {{this}} {{/each}}
    Proof: {{#each this.proof}} - {{this}} {{/each}}
    Problems: {{#each this.problems}} - {{this}} {{/each}}
    Possibilities: {{#each this.possibilities}} - {{this}} {{/each}}
  {{/each}}
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const rankPassionsFlow = ai.defineFlow(
  {
    name: 'rankPassionsFlow',
    inputSchema: RankPassionsInputSchema,
    outputSchema: RankPassionsOutputSchema,
  },
  async input => {
    const {output} = await rankPassionsPrompt(input);
    return output!;
  }
);

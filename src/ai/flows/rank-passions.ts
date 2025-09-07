'use server';

/**
 * @fileOverview Ranks passions based on user inputs in the 6Ps framework using GenAI.
 *
 * - rankPassions - A function that ranks passions based on user inputs.
 * - RankPassionsInput - The input type for the rankPassions function.
 * - RankPassionsOutput - The return type for the rankPassions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const FieldDetailsSchema = z.object({
    text: z.string().describe('The text content of the item.'),
    weight: z.enum(['high', 'medium', 'low', '']).describe('The weight assigned to the item.'),
});

const PassionDetailsSchema = z.object({
  passion: z.string().describe('The name of the passion.'),
  purpose: z.array(FieldDetailsSchema).describe('The purposes for this passion with their weights.'),
  power: z.array(FieldDetailsSchema).describe('The strengths for this passion with their weights.'),
  proof: z.array(FieldDetailsSchema).describe('The proofs for this passion with their weights.'),
  problems: z.array(FieldDetailsSchema).describe('The problems for this passion with their weights.'),
  possibilities: z.array(FieldDetailsSchema).describe('The possibilities for this passion with their weights.'),
});

const RankPassionsInputSchema = z.object({
  passions: z.array(PassionDetailsSchema).describe('An array of passions with their details.'),
  language: z.enum(['ar', 'en']).describe('The language for the response.'),
});
export type RankPassionsInput = z.infer<typeof RankPassionsInputSchema>;

const RankedPassionSchema = z.object({
  passion: z.string().describe('The name of the passion.'),
  score: z.number().describe('The calculated score for the passion.'),
  reasoning: z.string().describe('Explanation of the score.'),
});

const RankPassionsOutputSchema = z.object({
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

  The scoring model is as follows:
  - For Purpose, Power, Proof, and Possibilities: high weight = 3 points, medium weight = 2 points, low weight = 1 point. An empty weight counts as 1 point.
  - For Problems: high weight = -3 points, medium weight = -2 points, low weight = -1 point. An empty weight counts as -1 point.
  
  Calculate a total score for each passion by summing the points from all items across all categories. The score should reflect the overall potential and alignment of the passion with the user's inputs. A higher score is better.

  Return the passions ranked from highest to lowest score. For each passion, provide a comprehensive reasoning that explains how the score was calculated, mentioning the positive contributions from Purpose, Power, Proof, and Possibilities, and the negative impact of the Problems. Be specific and reference the user's own words.

  The entire response, especially the reasoning, MUST be in the specified language: {{language}}.
  If the language is 'ar', use colloquial Egyptian Arabic (اللهجة المصرية العامية).

  Here are the passions with their details:
  {{#each passions}}
    Passion: {{this.passion}}
    {{#if this.purpose}}
    Purposes:
    {{#each this.purpose}} - "{{this.text}}" (Weight: {{this.weight}})
    {{/each}}
    {{/if}}
    {{#if this.power}}
    Powers:
    {{#each this.power}} - "{{this.text}}" (Weight: {{this.weight}})
    {{/each}}
    {{/if}}
    {{#if this.proof}}
    Proofs:
    {{#each this.proof}} - "{{this.text}}" (Weight: {{this.weight}})
    {{/each}}
    {{/if}}
    {{#if this.problems}}
    Problems:
    {{#each this.problems}} - "{{this.text}}" (Weight: {{this.weight}})
    {{/each}}
    {{/if}}
    {{#if this.possibilities}}
    Possibilities:
    {{#each this.possibilities}} - "{{this.text}}" (Weight: {{this.weight}})
    {{/each}}
    {{/if}}
    ---
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

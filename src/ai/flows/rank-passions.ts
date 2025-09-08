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
    id: z.string(),
    text: z.string().describe('The text content of the item.'),
    weight: z.number().describe('The rating assigned to the item, from 1 to 5.'),
});

const PassionDetailsSchema = z.object({
  passion: z.string().describe('The name of the passion.'),
  purpose: z.array(FieldDetailsSchema).describe('The purposes for this passion with their ratings.'),
  power: z.array(FieldDetailsSchema).describe('The strengths for this passion with their ratings.'),
  proof: z.array(FieldDetailsSchema).describe('The proofs for this passion with their ratings.'),
  problems: z.array(FieldDetailsSchema).describe('The problems for this passion with their ratings.'),
  possibilities: z.array(FieldDetailsSchema).describe('The possibilities for this passion with their ratings.'),
});

const RankPassionsInputSchema = z.object({
  passions: z.array(PassionDetailsSchema).describe('An array of passions with their details.'),
  language: z.enum(['ar', 'en']).describe('The language for a response.'),
});
export type RankPassionsInput = z.infer<typeof RankPassionsInputSchema>;

const RankedPassionSchema = z.object({
  passion: z.string().describe('The name of the passion.'),
  score: z.number().describe('The calculated score for the passion.'),
  reasoning: z.string().describe('A qualitative, insightful explanation for the ranking. Should include actionable advice for growth.'),
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
  prompt: `You are an expert career coach helping young adults discover their passions. Your tone is encouraging, insightful, and realistic.

  You will receive a list of passions with details provided by the user, including a rating from 1 to 5 for each item. Rank these passions based on the user's input in each category (Purpose, Power, Proof, Problems, Possibilities).

  The scoring model is as follows (use this for ranking, but do not mention points in your response):
  - For Purpose, Power, Proof, and Possibilities: the rating (1-5) is the score. A rating of 0 or an empty item counts as 1 point.
  - For Problems: the rating (1-5) is a negative score (e.g., a rating of 5 becomes -5 points). A rating of 0 or an empty item counts as -1 point.
  
  Calculate a total score for each passion. Rank the passions from highest to lowest score.

  For each passion, provide a comprehensive "reasoning" that is both analytical and encouraging. This is the most important part.
  The reasoning must NOT mention the scoring or points. Instead, it should be a qualitative analysis that feels personal.
  - Start by summarizing why this passion scored the way it did in a narrative format. For example, "Your passion for [Passion Name] seems to shine brightly because of your strong sense of purpose and the clear strengths you possess. You gave high importance to how it helps you [mention a purpose], which shows a deep connection."
  
  - Conclude the reasoning for EACH passion with a "Next Steps" section. Provide 2-3 concrete, actionable pieces of advice.
  - For high-ranking passions, provide focused and detailed next steps to help the user start acting on this passion.
  - For lower-ranking passions, gently point out the challenges (problems) or weaker connections. The advice should be about re-evaluation, such as suggesting they spend less time on it, or find ways to merge its enjoyable aspects with a higher-ranking passion. For example, "You might find it more fulfilling to integrate your love for [lower-ranked passion] into your journey with [higher-ranked passion]."

  The entire response, especially the reasoning and advice, MUST be in the specified language: {{language}}.
  If the language is 'ar', use colloquial Egyptian Arabic (اللهجة المصرية العامية).

  Here are the passions with their details:
  {{#each passions}}
    Passion: {{this.passion}}
    {{#if this.purpose}}
    Purposes:
    {{#each this.purpose}} - "{{this.text}}" (Rating: {{this.weight}})
    {{/each}}
    {{/if}}
    {{#if this.power}}
    Powers:
    {{#each this.power}} - "{{this.text}}" (Rating: {{this.weight}})
    {{/each}}
    {{/if}}
    {{#if this.proof}}
    Proofs:
    {{#each this.proof}} - "{{this.text}}" (Rating: {{this.weight}})
    {{/each}}
    {{/if}}
    {{#if this.problems}}
    Problems:
    {{#each this.problems}} - "{{this.text}}" (Rating: {{this.weight}})
    {{/each}}
    {{/if}}
    {{#if this.possibilities}}
    Possibilities:
    {{#each this.possibilities}} - "{{this.text}}" (Rating: {{this.weight}})
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

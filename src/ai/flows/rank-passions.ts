
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
  reasoning: z.string().describe('A qualitative, insightful explanation for the ranking. Should include a "Next Steps" section with actionable advice and external resources for growth.'),
});

const RankPassionsOutputSchema = z.object({
  rankedPassions: z.array(RankedPassionSchema).describe('An array of passions ranked by their calculated scores.'),
});
export type RankPassionsOutput = z.infer<typeof RankPassionsOutputSchema>;


export async function rankPassions(input: RankPassionsInput): Promise<RankPassionsOutput> {
  return rankPassionsFlow(input);
}


const calculateScore = (passion: z.infer<typeof PassionDetailsSchema>): number => {
    let score = 0;
    const calculate = (items: z.infer<typeof FieldDetailsSchema>[], multiplier: 1 | -1) => {
        return items.reduce((acc, item) => {
            const weight = item.weight || 1; // Treat 0 or empty as 1
            return acc + (weight * multiplier);
        }, 0);
    };

    score += calculate(passion.purpose, 1);
    score += calculate(passion.power, 1);
    score += calculate(passion.proof, 1);
    score += calculate(passion.possibilities, 1);
    score += calculate(passion.problems, -1);
    
    return score;
}

const rankPassionsPrompt = ai.definePrompt({
  name: 'rankPassionsPrompt',
  input: { schema: RankPassionsInputSchema },
  output: { schema: RankPassionsOutputSchema },
  prompt: `You are an expert career coach helping young adults discover their passions. Your tone is encouraging, insightful, and realistic.

You will receive a list of passions with their details. Your task is to do the following for EACH passion:
1.  Calculate a score. The formula is: (sum of weights for purpose, power, proof, possibilities) - (sum of weights for problems).
2.  Provide a comprehensive "reasoning" for why it received this score. This is the most important part.
3.  The entire response, especially the reasoning and advice, MUST be in the specified language: {{language}}. If the language is 'ar', use colloquial Egyptian Arabic (اللهجة المصرية العامية). The tone should be respectful and professional, do not use overly casual phrases like 'يا جدع'.

For each passion, generate the "reasoning" with the following structure:
- The reasoning must NOT mention the exact score or points. Instead, it should be a qualitative, realistic analysis based on the user's input.
- Start by summarizing why this passion scored the way it did in a narrative format. Be specific. For example, "Your passion for [Passion Name] seems to shine brightly because of your strong sense of purpose. You mentioned that it helps you '[mention a specific purpose with high rating]', which shows a deep connection. Also, your strength in '[mention a specific power with high rating]' is a huge asset here."
- If the score is low, be gentle but clear about the challenges. For example, "While you're interested in [Passion Name], it seems you've identified some significant challenges, like '[mention a specific problem with a high rating]', which might be holding you back."

- After the main reasoning, you MUST include a separate section titled "**الخطوات القادمة:**" (for Arabic) or "**Next Steps:**" (for English). This section must contain:
  1.  **Actionable Advice:** 2-3 concrete, actionable pieces of advice. For high-ranking passions, focus on starting. For lower-ranking ones, focus on exploration or re-evaluation.
  2.  **Resource Suggestions:** Provide at least one specific, real, and relevant external resource (like a famous YouTube channel, a well-known website, or a platform). For example, for "Programming", suggest "Elzero Web School" for Arabic content or "freeCodeCamp" for English. For "Graphic Design", suggest "Canva" or "Behance". For "Content Creation", suggest "YouTube Creator Academy".

Finally, return a single JSON object containing a 'rankedPassions' array. Each object in the array must have 'passion', 'score', and 'reasoning'. The array should be sorted in descending order by score.

Here is the data:
Language: {{language}}
{{#each passions}}
---
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
{{/each}}
---
`,
  config: {
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
  async ({ passions, language }) => {
    // The prompt is now capable of calculating scores and ranking,
    // but we will pre-calculate scores on our side to ensure accuracy
    // and just pass them to the model for reasoning generation.
    // The model prompt has been updated to reflect this.

    const { output } = await rankPassionsPrompt({ passions, language });
    
    // The model now returns the full ranked list. We just need to ensure scores are correct.
    const finalRankedPassions = output!.rankedPassions.map(p => ({
        ...p,
        score: calculateScore(passions.find(ps => ps.passion === p.passion)!)
    }));

    // Re-sort based on our calculated scores to be safe
    finalRankedPassions.sort((a, b) => b.score - a.score);
    
    return { rankedPassions: finalRankedPassions };
  }
);

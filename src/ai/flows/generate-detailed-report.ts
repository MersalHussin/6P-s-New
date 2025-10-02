
'use server';

/**
 * @fileOverview Generates a detailed report of the user's passion journey.
 *
 * - generateDetailedReport - A function that creates a comprehensive text report.
 * - GenerateDetailedReportInput - The input type for the function.
 * - GenerateDetailedReportOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FieldItemSchema = z.object({
    id: z.string(),
    text: z.string(),
    weight: z.number(),
});

const SolutionAttemptSchema = z.object({
    attempt: z.number(),
    solutions: z.array(z.string()),
});

const PassionDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  purpose: z.array(FieldItemSchema),
  power: z.array(FieldItemSchema),
  proof: z.array(FieldItemSchema),
  problems: z.array(FieldItemSchema),
  possibilities: z.array(FieldItemSchema),
  suggestedSolutions: z.array(SolutionAttemptSchema).optional(),
});

const GenerateDetailedReportInputSchema = z.object({
  passions: z.array(PassionDataSchema),
  language: z.enum(['ar', 'en']),
});
export type GenerateDetailedReportInput = z.infer<typeof GenerateDetailedReportInputSchema>;

const GenerateDetailedReportOutputSchema = z.object({
  report: z.string().describe('The detailed text report in the specified language, formatted with markdown for clarity.'),
});
export type GenerateDetailedReportOutput = z.infer<typeof GenerateDetailedReportOutputSchema>;

export async function generateDetailedReport(
  input: GenerateDetailedReportInput
): Promise<GenerateDetailedReportOutput> {
  return generateDetailedReportFlow(input);
}

const reportPrompt = ai.definePrompt({
  name: 'generateDetailedReportPrompt',
  input: { schema: GenerateDetailedReportInputSchema },
  output: { schema: GenerateDetailedReportOutputSchema },
  prompt: `
  You are an expert report writer. Create a comprehensive and detailed text report in {{language}} based on the user's passion discovery journey data.

  The report should be well-structured, easy to read, and provide valuable insights to the user.

  Structure the report with a main introduction, then a section for each passion.
  For each passion, use the following markdown format:
  - Use '##' for the passion name as a main heading.
  - Use '###' for each of the 6 P's (Purpose, Power, etc.) as subheadings.
  - Use markdown bullet points ('* ' or '- ') for the items within each section.
  - If a section has no items, state that clearly (e.g., "No items were provided for this section.").
  - Conclude the entire report with a general summary and recommendations section under a '##' heading.
  - If the language is 'ar', the entire report must be in Arabic.

  Data provided by the user:
  {{#each passions}}
  ---
  **Passion: {{{this.name}}}**

  **1. Purpose:**
  {{#each this.purpose}}
  - Purpose: {{{this.text}}} (Rating: {{{this.weight}}}/5)
  {{/each}}

  **2. Power:**
   {{#each this.power}}
  - {{{this.text}}} (Rating: {{{this.weight}}}/5)
  {{/each}}

  **3. Proof:**
   {{#each this.proof}}
  - {{{this.text}}} (Rating: {{{this.weight}}}/5)
  {{/each}}

  **4. Problems:**
   {{#each this.problems}}
  - {{{this.text}}} (Rating: {{{this.weight}}}/5)
  {{/each}}

  **5. Suggested Solutions for Problems:**
  {{#if this.suggestedSolutions}}
    {{#each this.suggestedSolutions}}
    **Attempt {{this.attempt}}:**
    {{#each this.solutions}}
    - {{{this}}}
    {{/each}}
    {{/each}}
  {{else}}
    No solutions were generated.
  {{/if}}

  **6. Possibilities:**
  {{#each this.possibilities}}
  - {{{this.text}}} (Rating: {{{this.weight}}}/5)
  {{/each}}
  ---
  {{/each}}

  Now, create a detailed, well-formatted markdown report based on this data in {{language}}.
  `,
});


const generateDetailedReportFlow = ai.defineFlow(
    {
      name: 'generateDetailedReportFlow',
      inputSchema: GenerateDetailedReportInputSchema,
      outputSchema: GenerateDetailedReportOutputSchema,
    },
    async (input) => {
        const { output } = await reportPrompt(input, { model: 'googleai/gemini-1.5-flash-latest' });
        return output!;
    }
);

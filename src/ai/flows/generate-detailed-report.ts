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
});

const PurposeSchema = FieldItemSchema.extend({
  weight: z.enum(['high', 'medium', 'low', '']),
});

const PassionDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  purpose: z.array(PurposeSchema),
  power: z.array(FieldItemSchema),
  proof: z.array(FieldItemSchema),
  problems: z.array(FieldItemSchema),
  possibilities: z.array(FieldItemSchema),
  suggestedSolutions: z.array(z.string()).optional(),
});

const GenerateDetailedReportInputSchema = z.object({
  passions: z.array(PassionDataSchema),
  language: z.enum(['ar', 'en']),
});
export type GenerateDetailedReportInput = z.infer<typeof GenerateDetailedReportInputSchema>;

const GenerateDetailedReportOutputSchema = z.object({
  report: z.string().describe('The detailed text report in the specified language.'),
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

  Use headings and formatting (like bullet points) to make the report clear. Start with a brief introduction, then provide an analysis for each passion individually, and conclude the report with a general summary and recommendations.

  Data provided by the user:
  {{#each passions}}
  ---
  **Passion: {{{this.name}}}**

  **1. Purpose:**
  {{#each this.purpose}}
  - Purpose: {{{this.text}}} (Weight: {{{this.weight}}})
  {{/each}}

  **2. Power:**
   {{#each this.power}}
  - {{{this.text}}}
  {{/each}}

  **3. Proof:**
   {{#each this.proof}}
  - {{{this.text}}}
  {{/each}}

  **4. Problems:**
   {{#each this.problems}}
  - {{{this.text}}}
  {{/each}}

  **5. Suggested Solutions for Problems:**
  {{#if this.suggestedSolutions}}
    {{#each this.suggestedSolutions}}
    - {{{this}}}
    {{/each}}
  {{else}}
    No solutions were generated.
  {{/if}}

  **6. Possibilities:**
  {{#each this.possibilities}}
  - {{{this.text}}}
  {{/each}}
  ---
  {{/each}}

  Now, create a detailed report based on this data in {{language}}.
  `,
});


const generateDetailedReportFlow = ai.defineFlow(
    {
      name: 'generateDetailedReportFlow',
      inputSchema: GenerateDetailedReportInputSchema,
      outputSchema: GenerateDetailedReportOutputSchema,
    },
    async (input) => {
        const { output } = await reportPrompt(input);
        return output!;
    }
);

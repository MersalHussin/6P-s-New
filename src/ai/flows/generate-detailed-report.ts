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

const PurposeSchema = z.object({
  id: z.string(),
  text: z.string(),
  weight: z.enum(['high', 'medium', 'low', '']),
});

const PassionDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  purpose: z.array(PurposeSchema),
  power: z.string(),
  proof: z.string(),
  problems: z.string(),
  possibilities: z.string(),
  suggestedSolutions: z.array(z.string()).optional(),
});

export const GenerateDetailedReportInputSchema = z.object({
  passions: z.array(PassionDataSchema),
});
export type GenerateDetailedReportInput = z.infer<typeof GenerateDetailedReportInputSchema>;

const GenerateDetailedReportOutputSchema = z.object({
  report: z.string().describe('The detailed text report in Arabic.'),
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
  أنت مساعد خبير في كتابة التقارير. قم بإنشاء تقرير نصي شامل ومفصل باللغة العربية بناءً على بيانات رحلة اكتشاف الشغف للمستخدم.

  يجب أن يكون التقرير منظماً بشكل جيد، وسهل القراءة، ويقدم رؤى قيمة للمستخدم.

  استخدم العناوين والتنسيق (مثل القوائم النقطية) لجعل التقرير واضحاً. ابدأ بمقدمة موجزة، ثم قدم تحليلاً لكل شغف على حدة، واختتم التقرير بملخص عام وتوصيات.

  البيانات المقدمة من المستخدم:
  {{#each passions}}
  ---
  **الشغف: {{{this.name}}}**

  **1. الهدف (Purpose):**
  {{#each this.purpose}}
  - الهدف: {{{this.text}}} (الأهمية: {{{this.weight}}})
  {{/each}}

  **2. القوة (Power):**
  {{{this.power}}}

  **3. الإثبات (Proof):**
  {{{this.proof}}}

  **4. المشاكل (Problems):**
  {{{this.problems}}}

  **5. الحلول المقترحة للمشاكل:**
  {{#if this.suggestedSolutions}}
    {{#each this.suggestedSolutions}}
    - {{{this}}}
    {{/each}}
  {{else}}
    لم يتم إنشاء حلول.
  {{/if}}

  **6. الاحتمالات (Possibilities):**
  {{{this.possibilities}}}
  ---
  {{/each}}

  الآن، قم بإنشاء تقرير مفصل بناءً على هذه البيانات.
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

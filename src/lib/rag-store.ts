import { ai, DEFAULT_MODEL } from './vertex-client';

export class LegalAdvisor {
  async queryLegalContext(question: string): Promise<string> {
    const systemPrompt = `You are an expert Indian Legal Advisor specializing in food safety and logistics.
Context to rely on:
- FSSAI Act 2006 (Food Safety and Standards Act)
- FSS Rules 2011
- Food Safety Standards Regulations
- Logistics liability and insurance standards for perishable goods in India.

Based on this context, answer the user's legal question accurately and professionally. Do not make up non-existent laws, but provide a contextually relevant and specific legal answer.`;

    const result = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      systemInstruction: systemPrompt,
      contents: question,
    });
    
    return result.text || 'Unable to generate legal context at this time.';
  }
}

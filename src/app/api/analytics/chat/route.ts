import { NextResponse } from 'next/server';
import { ai, DEFAULT_MODEL } from '@/lib/vertex-client';
import { BigQueryService } from '@/lib/bigquery';

const bqService = new BigQueryService();

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Step 1: Use Vertex AI to generate a SQL query and reasoning based on user input
    const prompt = `
      You are an AI Analyst Agent for a Cold Chain Logistics company.
      The user asks: "${message}"
      
      Generate a valid SQL query to answer this question from a 'telemetry' table.
      Also provide a brief summary answering the question.
      Format your response as a raw JSON object (without markdown blocks) like this:
      {
        "sql": "SELECT ...",
        "summary": "Brief summary..."
      }
    `;

    const result = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
    });

    const responseText = result.text || '';
    
    // Parse the JSON from the markdown block or direct output
    let parsedResponse;
    try {
        const jsonMatch = responseText.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || responseText.match(/{[\s\S]*?}/);
        const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText;
        parsedResponse = JSON.parse(jsonString.trim());
    } catch (e) {
        parsedResponse = {
            sql: "SELECT * FROM telemetry LIMIT 10;",
            summary: responseText,
        };
    }

    // Step 2: Use BigQuery service to get data
    const data = await bqService.query(parsedResponse.sql || message);

    // Return the summary and the data
    return NextResponse.json({
      summary: parsedResponse.summary,
      sql: parsedResponse.sql,
      data: data,
    });
  } catch (error: any) {
    console.error('Error in chat analytics route:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

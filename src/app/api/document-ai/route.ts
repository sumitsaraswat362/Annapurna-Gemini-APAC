import { ai, DEFAULT_MODEL } from "@/lib/vertex-client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    const prompt = `Analyze this document image (Invoice, Bill of Lading, Manifest, etc.)
Extract the following structured data and return a JSON object ONLY, with NO markdown formatting, with this exact structure:
{
  "weight": string (total weight or "N/A"),
  "tempRequired": string (temperature requirements like "-5°C" or "N/A"),
  "price": string (total value/amount or "N/A"),
  "date": string (document date or "N/A"),
  "type": string (document type like "Invoice", "Bill of Lading", etc.)
}`;

    let base64Data = "";
    let mimeType = "image/jpeg";

    if (image.startsWith('http://') || image.startsWith('https://')) {
      const imageResp = await fetch(image);
      const arrayBuffer = await imageResp.arrayBuffer();
      base64Data = Buffer.from(arrayBuffer).toString("base64");
      mimeType = imageResp.headers.get("content-type") || "image/jpeg";
    } else if (image.startsWith('data:image') || image.startsWith('data:application/pdf')) {
      mimeType = image.split(';')[0].split(':')[1];
      base64Data = image.split(',')[1];
    } else {
      return NextResponse.json(
        { error: "Invalid image format. Must be a URL or data URI." },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { inlineData: { mimeType, data: base64Data } }
          ]
        }
      ]
    });

    const responseText = response.text || "";
    const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse Gemini response:", cleanedText);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error("Document AI Error:", error);
    return NextResponse.json(
      { error: "Failed to process document" },
      { status: 500 }
    );
  }
}

import { GoogleGenerativeAI } from "@google/generative-ai";
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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this image of food/cargo for quality control.
Assess if there is any spoilage, rot, or damage.
Return a JSON object ONLY, with NO markdown formatting, with this exact structure:
{
  "spoilagePercentage": number (0-100),
  "reasoning": string (brief explanation of what you see and why you gave that percentage)
}`;

    let result;

    if (image.startsWith('http://') || image.startsWith('https://')) {
      // If it's a URL, we'd normally need to fetch it first since Gemini expects base64 for vision.
      // But for hackathon/simplicity, let's fetch it and convert to base64.
      const imageResp = await fetch(image);
      const arrayBuffer = await imageResp.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = imageResp.headers.get("content-type") || "image/jpeg";
      
      const imageParts = [
        {
          inlineData: {
            data: buffer.toString("base64"),
            mimeType
          },
        },
      ];
      
      result = await model.generateContent([prompt, ...imageParts]);
    } else if (image.startsWith('data:image')) {
      // Base64
      const mimeType = image.split(';')[0].split(':')[1];
      const base64Data = image.split(',')[1];
      
      const imageParts = [
        {
          inlineData: {
            data: base64Data,
            mimeType
          },
        },
      ];
      
      result = await model.generateContent([prompt, ...imageParts]);
    } else {
        return NextResponse.json(
            { error: "Invalid image format. Must be a URL or data URI." },
            { status: 400 }
        );
    }

    const responseText = result.response.text();
    // Clean up response if the model added markdown blocks despite instructions
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
    console.error("Vision AI Error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define the system prompt for the flashcard generation
const systemPrompt = `
You are a flashcard creator. You take in text and create multiple flashcards from it. Make sure to create exactly 12 flashcards.
Both the front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Q: Front of the card",
      "back": "A: Back of the card"
    }
  ]
}
`;

export async function POST(req) {
  try {
    // Initialize the GoogleGenerativeAI client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Get request body
    const data = await req.text();

    // Generate flashcard content
    const result = await model.generateContent(systemPrompt + '\n' + data);

    // Assuming the result has a `response` property with the generated text
    const flashcards = JSON.parse(result.response.text());

    // Return flashcards as JSON response
    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
  }
}
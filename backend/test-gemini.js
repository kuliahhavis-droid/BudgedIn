import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDqJaW8nlHB_74-B3_kRCVyV5Vkey300eU";

console.log("Using API Key:", apiKey);
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log("Attempting to generate a simple response...");
    const result = await model.generateContent("Hello!");
    console.log("Success! Response text:", result.response.text());
  } catch (err) {
    console.error("Failed to generate content:", err);
  }
}

run();

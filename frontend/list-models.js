import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: 'd:/WEB/BudgedIn/frontend/.env' });

const apiKey = process.env.GEMINI_API_KEY;

async function run() {
  if (!apiKey) {
    console.error('No GEMINI_API_KEY');
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    console.log('Fetching available models for your API key...');
    // The Google Generative AI SDK exposes a way to access the list, but since it is REST-based under the hood,
    // we can make a direct fetch to the Google API endpoint to get the full list of models for this key.
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      console.error('API Error:', data.error);
      return;
    }
    
    console.log('\n=== AVAILABLE MODELS ===');
    const list = data.models || [];
    console.log(`Found ${list.length} models:`);
    list.forEach(m => {
      console.log(`- ${m.name} (${m.displayName}) - Supported: ${m.supportedGenerationMethods.join(', ')}`);
    });
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

run();

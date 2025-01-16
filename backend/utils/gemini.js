const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

async function getGeminiResponse(prompt, projectData) {
  try {
    const contextPrompt = `
      You are an AI assistant for a task management application. You have access to the following project data:

      ${JSON.stringify(projectData, null, 2)}

      Please provide a helpful, accurate, and concise response to the following user query:

      User Query: ${prompt}

      If only when the user wants to create a task, guide them through the process by asking for the following information one by one:
      1. Task name
      2. Priority (P0, P1, or P2)
      3. Description
      4. Assigned story points
      5. Actual story points
      6. Due date (YYYY-MM-DD format)

      For any project-related queries, provide specific details and statistics when possible.
      If the query is outside the scope of the project or task management, politely inform the user that you can only assist with project-related questions.
    `;

    const response = await axios.post(`${API_URL}?key=${GEMINI_API_KEY}`, {
      contents: [{
        parts: [{
          text: contextPrompt
        }]
      }]
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "I apologize, but I'm having trouble processing your request at the moment. Please try again later.";
  }
}

module.exports = { getGeminiResponse };


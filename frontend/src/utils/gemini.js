export async function getGeminiResponse(prompt, projectData) {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, projectData }),
    });

    if (!response.ok) {
      throw new Error('Failed to get Gemini response');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error getting Gemini response:', error);
    return "I apologize, but I'm having trouble processing your request at the moment. Please try again later.";
  }
}


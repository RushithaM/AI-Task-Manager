// src/utils/gemini.js
export async function getGeminiResponse(prompt, tasks, projectDetails) {
    const GEMINI_API_KEY = GEMINI_API_KEY; 
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  
    try {
      // Create a structured context for the AI
      const systemContext = `
        You are a task management assistant. Current project context:
        
        Tasks Summary:
        - Total Tasks: ${tasks.length}
        - Pending: ${tasks.filter(t => t.status === 'Pending').length}
        - In Progress: ${tasks.filter(t => t.status === 'In Progress').length}
        - Completed: ${tasks.filter(t => t.status === 'Completed').length}
        
        Priority Distribution:
        - P0: ${tasks.filter(t => t.priority === 'P0').length}
        - P1: ${tasks.filter(t => t.priority === 'P1').length}
        - P2: ${tasks.filter(t => t.priority === 'P2').length}
        
        Project Details:
        ${JSON.stringify(projectDetails, null, 2)}
        
        Available Task Actions:
        1. View tasks by status, priority, or type
        2. Create new tasks
        3. Update existing tasks
        4. Get project statistics
        
        User Query: ${prompt}
        
        If the user asks to see tasks, format them in a clear list.
        If the user wants to create a task, respond with CREATE_TASK: followed by the task JSON.
        If the user wants to update a task, respond with UPDATE_TASK: followed by the task JSON.
        For all other queries, provide a helpful response based on the project context.
      `;
  
      const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemContext
            }]
          }]
        })
      });
  
      if (!response.ok) {
        throw new Error('API request failed');
      }
  
      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid API response format');
      }
  
      const aiResponse = data.candidates[0].content.parts[0].text;
  
      // Process the response based on the command
      if (aiResponse.includes('CREATE_TASK:')) {
        const taskJson = aiResponse.split('CREATE_TASK:')[1].trim();
        // You might want to validate the JSON here
        return {
          type: 'CREATE_TASK',
          data: JSON.parse(taskJson)
        };
      } else if (aiResponse.includes('UPDATE_TASK:')) {
        const taskJson = aiResponse.split('UPDATE_TASK:')[1].trim();
        return {
          type: 'UPDATE_TASK',
          data: JSON.parse(taskJson)
        };
      } else {
        return {
          type: 'MESSAGE',
          data: aiResponse
        };
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }
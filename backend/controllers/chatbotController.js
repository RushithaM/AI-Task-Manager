const axios = require("axios");
const Task = require("../models/taskModel");

const chatbotHandler = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // Fetch all tasks from the database
    const tasks = await Task.find();
    const formattedTasks = tasks.map((task) => ({
      id: task._id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      type: task.type,
      sp_assigned: task.sp_assigned,
      sp_actual: task.sp_actual,
      due_date: task.due_date,
    }));

    // Construct the Gemini prompt with task information
  const geminiPrompt = `
  You are a task management assistant. 
  Respond to user queries about tasks. 

  Example queries:
  - "Which tasks are due today?"
  - "Show tasks with priority P0."
  - "How many tasks are completed?"

  If the query is unrelated to the provided task information, respond with "Not in scope."

  User query: ${prompt}
`;

    // Gemini API endpoint
    const geminiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateText";

    // Gemini API request payload
    const geminiPayload = {
      prompt: geminiPrompt,
    };

    // Headers with Gemini API key
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
    };

    // Make the request to Gemini API
    const geminiResponse = await axios.post(geminiUrl, geminiPayload, {
      headers,
    });

    const aiResponse = geminiResponse.data.generated_text;
    res.json({ response: aiResponse });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized request: Invalid API key");
    } else {
      console.error("Error processing request:", error.message);
    }
    res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
  }
};

module.exports = { chatbotHandler };

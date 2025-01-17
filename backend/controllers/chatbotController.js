const { GoogleGenerativeAI } = require("@google/generative-ai");
const Task = require("../models/taskModel"); // Import your Task model

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chatbotHandler = async (req, res) => {
  try {
    const { prompt } = req.body; // Extract 'prompt' from the request body

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required." });
    }

    // Fetch all tasks from the database
    const tasks = await Task.find();
    if (!tasks.length) {
      return res
        .status(404)
        .json({ message: "No data found in the database." });
    }

    // Convert the database data to a prompt-friendly format
    const taskData = tasks
      .map(
        (task) => `
        Title: ${task.title}
        Description: ${task.description || "N/A"}
        Status: ${task.status}
        Priority: ${task.priority}
        Type: ${task.type || "N/A"}
        SP Assigned: ${task.sp_assigned || "N/A"}
        SP Actual: ${task.sp_actual || "N/A"}
        Due Date: ${
          task.due_date ? task.due_date.toISOString().split("T")[0] : "N/A"
        }
      `
      )
      .join("\n\n");

    // Combine database data with the user question
    const fullPrompt = `
      Below is the task data from the database:
      ${taskData}
      
      Based on this data, answer the following question:
      "${prompt}"
      
      If the question is not related to the given data, reply with "The question is out of context."
    `;

    // Generate a response from Gemini API
    const result = await model.generateContent(fullPrompt);
    const aiResponse = result.response.text();

    // Send the AI-generated response
    res.status(200).json({ result: aiResponse });
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred.", error: error.message });
  }
};

module.exports = { chatbotHandler };

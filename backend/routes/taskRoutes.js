const express = require("express");
const {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { getGeminiResponse } = require('../utils/gemini');
const router = express.Router();

router.get("/", getTasks);
router.post("/add", addTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

router.post("/gemini", async (req, res) => {
  try {
    const { prompt, projectData } = req.body;
    const response = await getGeminiResponse(prompt, projectData);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: "Error processing Gemini request", error: error.message });
  }
});

module.exports = router;


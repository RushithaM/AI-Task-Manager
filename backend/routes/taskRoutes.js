const express = require("express");
const {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { chatbotHandler } = require("../controllers/chatbotController");
const router = express.Router();

router.get("/", getTasks);
router.post("/add", addTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.post("/chat", chatbotHandler);

module.exports = router;

const Task = require("../models/taskModel");

const getTasks = async (req, res) => {
  try {
    const { status, priority, type } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (type) filter.type = type;

    const tasks = Object.keys(filter).length === 0
      ? await Task.find()
      : await Task.find(filter);

    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};

const addTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: "Error adding task", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const id = req.params.id.trim();
    const updatedData = req.body;

    const updatedTask = await Task.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};

module.exports = { getTasks, addTask, updateTask, deleteTask };


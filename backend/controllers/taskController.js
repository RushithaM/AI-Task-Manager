const Task = require("../models/taskModel");

const getTasks = async (req, res) => {
  try {
    const { status, priority, type } = req.query; // Extract query parameters
    const filter = {};

    // Check if there are any query parameters and apply filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (type) filter.type = type;

    // If no filters are provided, return all tasks, otherwise return filtered tasks
    const tasks =
      Object.keys(filter).length === 0
        ? await Task.find() // No filter applied, fetch all tasks
        : await Task.find(filter); // Apply filters if provided

    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};


const addTask = async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
};


const updateTask = async (req, res) => {
  try {
    const id = req.params.id.trim(); // Trim any whitespace or newline characters
    const updatedData = req.body; // Get the updated data from the request body

    // Find the task by ID and update it
    const updatedTask = await Task.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      
    });

    // If no task is found, return a 404 error
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Return the updated task
    res.json(updatedTask);
  } catch (error) {
    console.error(error.message);

    // Handle errors and respond with appropriate message
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};


const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).json({ message: "Task deleted" });
};

module.exports = { getTasks, addTask, updateTask, deleteTask };


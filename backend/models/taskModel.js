const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  priority: { type: String, enum: ["P0", "P1", "P2"], required: true },
  type: { type: String },
  sp_assigned: { type: Number },
  sp_actual: { type: Number },
  due_date: { type: Date },
});

module.exports = mongoose.model("Task", taskSchema);

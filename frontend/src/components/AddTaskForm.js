import React, { useState } from 'react';
import './AddTaskForm.css';

function AddTaskForm({ onClose, onTaskAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'P1',
    type: '',
    sp_assigned: 0,
    sp_actual: 0,
    due_date: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      onTaskAdded();
      onClose();
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    }
  };

  return (
    <div className="add-task-form-overlay">
      <div className="add-task-form">
        <h2>Add New Task</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Title" required onChange={handleChange} />
          <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
          <select name="priority" onChange={handleChange}>
            <option value="P0">P0</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
          </select>
          <select name="type" value={formData.type} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="Bug">Bug</option>
            <option value="Enhancement">Enhancement</option>
            <option value="Feature">Feature</option>
          </select>
          <input type="number" name="sp_assigned" placeholder="SP Assigned" onChange={handleChange} />
          <input type="number" name="sp_actual" placeholder="SP Actual" onChange={handleChange} />
          <input type="date" name="due_date" onChange={handleChange} />
          <button type="submit">Add Task</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default AddTaskForm;


import React from 'react';
import TaskCard from './TaskCard';
import './TaskList.css';

function TaskList({ title, tasks, onTaskUpdated, onTaskDeleted }) {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const newStatus = title === 'To Do' ? 'Pending' : title === 'In Progress' ? 'In Progress' : 'Completed';

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      onTaskUpdated();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  return (
    <div className="task-list" onDragOver={handleDragOver} onDrop={handleDrop}>
      <h2>{title}</h2>
      {tasks.map(task => (
        <TaskCard 
          key={task._id} 
          task={task} 
          onTaskUpdated={onTaskUpdated} 
          onTaskDeleted={onTaskDeleted}
        />
      ))}
    </div>
  );
}

export default TaskList;


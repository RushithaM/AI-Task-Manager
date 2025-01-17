import React, { useState } from 'react';
import TaskCard from '../TaskCard/TaskCard';
import './TaskList.css';

function TaskList({ title, tasks, onTaskUpdated, onTaskDeleted }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    const newStatus = title === 'To Do' ? 'Pending' : title === 'In Progress' ? 'In Progress' : 'Completed';

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`, {
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
    <div 
      className={`task-list ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
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


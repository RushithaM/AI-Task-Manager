import React from 'react';
import TaskList from '../TaskList/TaskList';
import './TaskBoard.css';

function TaskBoard({ tasks, onTaskUpdated, onTaskDeleted }) {
  const todoTasks = tasks.filter(task => task.status === 'Pending');
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress');
  const completedTasks = tasks.filter(task => task.status === 'Completed');

  // handleTaskDeleted is no longer needed here as onTaskDeleted is passed directly
  // const handleTaskDeleted = (taskId) => {
  //   onTaskUpdated();
  // };

  const handleTaskUpdated = async () => {
    await onTaskUpdated();
    
    // Add animation class to the last moved task
    const allTaskCards = document.querySelectorAll('.task-card');
    const lastTaskCard = allTaskCards[allTaskCards.length - 1];
    if (lastTaskCard) {
      lastTaskCard.classList.add('dropped');
      setTimeout(() => {
        lastTaskCard.classList.remove('dropped');
      }, 500);
    }
  };

  return (
    <div className="task-board">
      <TaskList 
        title="To Do" 
        tasks={todoTasks} 
        onTaskUpdated={handleTaskUpdated} 
        onTaskDeleted={onTaskDeleted}
      />
      <TaskList 
        title="In Progress" 
        tasks={inProgressTasks} 
        onTaskUpdated={handleTaskUpdated} 
        onTaskDeleted={onTaskDeleted}
      />
      <TaskList 
        title="Completed" 
        tasks={completedTasks} 
        onTaskUpdated={handleTaskUpdated} 
        onTaskDeleted={onTaskDeleted}
      />
    </div>
  );
}

export default TaskBoard;


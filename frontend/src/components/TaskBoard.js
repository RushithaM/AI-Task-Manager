import React from 'react';
import TaskList from './TaskList';
import './TaskBoard.css';

function TaskBoard({ tasks, onTaskUpdated }) {
  const todoTasks = tasks.filter(task => task.status === 'Pending');
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress');
  const completedTasks = tasks.filter(task => task.status === 'Completed');

  const handleTaskDeleted = (taskId) => {
    onTaskUpdated();
  };

  return (
    <div className="task-board">
      <TaskList 
        title="To Do" 
        tasks={todoTasks} 
        onTaskUpdated={onTaskUpdated} 
        onTaskDeleted={handleTaskDeleted}
      />
      <TaskList 
        title="In Progress" 
        tasks={inProgressTasks} 
        onTaskUpdated={onTaskUpdated} 
        onTaskDeleted={handleTaskDeleted}
      />
      <TaskList 
        title="Completed" 
        tasks={completedTasks} 
        onTaskUpdated={onTaskUpdated} 
        onTaskDeleted={handleTaskDeleted}
      />
    </div>
  );
}

export default TaskBoard;


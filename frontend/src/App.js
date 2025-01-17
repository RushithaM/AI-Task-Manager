import React, { useState, useEffect } from 'react';

import AddTaskForm from './components/AddTaskForm/AddTaskForm';
import AIChatModal from './components/AIChatModal/AIChatModal';
import Chart from './components/Chart/Chart';
import FilterBar from './components/FilterBar/FilterBar';
import Header from './components/Header/Header';
import TaskBoard from './components/TaskBoard/TaskBoard';

import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    type: '',
    search: '',
    sort: 'due_date'
  });

  const applyFilters = () => {
    let filtered = [...tasks];

    if (filters.search) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status && filters.status !== 'All Statuses') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.priority && filters.priority !== 'All Priorities') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.type && filters.type !== 'All Types') {
      filtered = filtered.filter(task => task.type === filters.type);
    }

    if (filters.sort === 'due_date') {
      filtered.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    } else if (filters.sort === 'priority') {
      filtered.sort((a, b) => a.priority.localeCompare(b.priority));
    }

    setFilteredTasks(filtered);
  };
  const handleTaskDeleted = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    setFilteredTasks(prevFilteredTasks => prevFilteredTasks.filter(task => task._id !== taskId));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
      setFilteredTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getProjectData = () => {
    return {
      tasks: tasks,
      filteredTasks: filteredTasks,
      filters: filters,
      projectStats: {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'Completed').length,
        inProgressTasks: tasks.filter(t => t.status === 'In Progress').length,
        pendingTasks: tasks.filter(t => t.status === 'Pending').length,
        p0Tasks: tasks.filter(t => t.priority === 'P0').length,
        p1Tasks: tasks.filter(t => t.priority === 'P1').length,
        p2Tasks: tasks.filter(t => t.priority === 'P2').length,
      },
      deadlines: tasks
        .filter(t => t.due_date)
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 5)
        .map(t => ({ id: t._id, title: t.title, dueDate: t.due_date })),
    };
  };

  return (
    <div className="app">
      <Header setShowAIChat={setShowAIChat} setShowAddForm={setShowAddForm} />
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      
      <Chart tasks={filteredTasks} />
      <TaskBoard 
        tasks={filteredTasks} 
        onTaskUpdated={fetchTasks} 
        onTaskDeleted={handleTaskDeleted}
      />
      {showAddForm && (
        <AddTaskForm onClose={() => setShowAddForm(false)} onTaskAdded={fetchTasks} />
      )}
      <AIChatModal 
        isOpen={showAIChat} 
        onClose={() => setShowAIChat(false)} 
        projectData={getProjectData()}
        onTaskAdded={fetchTasks}
      />
    </div>
  );
}

export default App;
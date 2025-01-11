import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import TaskBoard from './components/TaskBoard';
import AddTaskForm from './components/AddTaskForm';
import Chart from './components/Chart';
import AIChatModal from './components/AIChatModal';
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
    search: ''
  });
  const [projectDetails, setProjectDetails] = useState({
    name: "AI Task Manager",
    version: "1.0.0",
    description: "A task management application with AI assistance",
    // Add any other relevant project details
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
      setFilteredTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    if (filters.search) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.type) {
      filtered = filtered.filter(task => task.type === filters.type);
    }

    setFilteredTasks(filtered);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">AI Task Manager</h1>
        <div className="header-buttons">
          <button className="ai-button" onClick={() => setShowAIChat(true)}>Ask AI</button>
          <button className="create-task-button" onClick={() => setShowAddForm(true)}>
            <Plus size={16} />
            Create Task
          </button>
        </div>
      </header>

      <div className="filters-section">
        <div className="filter-group">
          <label className="filter-label">Status:</label>
          <select 
            className="filter-select"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Priority:</label>
          <select 
            className="filter-select"
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
          >
            <option value="">All Priorities</option>
            <option value="P0">P0</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Type:</label>
          <select 
            className="filter-select"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="Feature">Feature</option>
            <option value="Bug">Bug</option>
            <option value="Enhancement">Enhancement</option>
          </select>
        </div>
      </div>

      <TaskBoard tasks={filteredTasks} onTaskUpdated={fetchTasks} />
      {showAddForm && (
        <AddTaskForm onClose={() => setShowAddForm(false)} onTaskAdded={fetchTasks} />
      )}
      <Chart tasks={filteredTasks} />
      <AIChatModal 
  isOpen={showAIChat} 
  onClose={() => setShowAIChat(false)} 
  tasks={filteredTasks} 
  projectDetails={projectDetails}
  onTaskAdded={fetchTasks}
  onTaskUpdated={fetchTasks}
/>
    </div>
  );
}

export default App;


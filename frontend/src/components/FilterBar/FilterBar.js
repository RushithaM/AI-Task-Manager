import React from 'react';
import './FilterBar.css';

function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Status:</label>
        <select 
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option>All Statuses</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Priority:</label>
        <select 
          value={filters.priority}
          onChange={(e) => onFilterChange('priority', e.target.value)}
        >
          <option>All Priorities</option>
          <option>P0</option>
          <option>P1</option>
          <option>P2</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Type:</label>
        <select 
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
        >
          <option>All Types</option>
          <option>Feature</option>
          <option>Bug</option>
          <option>Enhancement</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Search:</label>
        <input 
          type="text" 
          placeholder="Search tasks..." 
          onChange={(e) => onFilterChange('search', e.target.value)} 
        />
      </div>

      <div className="filter-group">
        <label>Sort by:</label>
        <select 
          onChange={(e) => onFilterChange('sort', e.target.value)}
        >
          <option value="due_date">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;


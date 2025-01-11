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
          <option>Design</option>
          <option>Development</option>
          <option>Testing</option>
        </select>
      </div>

      {/* <button className="apply-filters-btn">Apply Filters</button> */}
    </div>
  );
}

export default FilterBar;


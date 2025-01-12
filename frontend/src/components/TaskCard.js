import React, { useState } from 'react';
import { MoreVertical, Calendar, Trash2 } from 'lucide-react';
import './TaskCard.css';

function TaskCard({ task, onTaskDeleted }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task._id);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${task._id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          onTaskDeleted(task._id);
        } else {
          throw new Error('Failed to delete task');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  const calculateProgress = () => {
    if (task.sp_actual && task.sp_assigned) {
      return Math.min((task.sp_actual / task.sp_assigned) * 100, 100);
    }
    return 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#10b981';
      case 'In Progress': return '#3b82f6';
      case 'Pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'P0': return '#ef4444';
      case 'P1': return '#f59e0b';
      case 'P2': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div 
      className={`task-card ${isExpanded ? 'expanded' : ''}`} 
      draggable 
      onDragStart={handleDragStart}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="task-card-content">
        <div className="task-header">
          <div className="task-title-section">
            <h3 className="task-title">{task.title}</h3>
            <div className="task-badges">
              <span className="status-badge" style={{ backgroundColor: getStatusColor(task.status) }}>
                {task.status}
              </span>
              <span className="priority-badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                {task.priority}
              </span>
            </div>
          </div>
          <button className="more-button">
            <MoreVertical size={16} />
          </button>
        </div>

        <p className="task-description">{task.description}</p>
        
        <div className="task-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${calculateProgress()}%`,
                backgroundColor: getStatusColor(task.status)
              }}
            />
          </div>
        </div>

        {isExpanded && (
          <div className="expanded-content">
            <div className="expanded-section">
              <h4>Details</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Type</span>
                  <span className="detail-value">{task.type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Story Points</span>
                  <span className="detail-value">{task.sp_assigned}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Actual Points</span>
                  <span className="detail-value">{task.sp_actual}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Created</span>
                  <span className="detail-value">
                    {new Date(task.due_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="task-footer">
          <div className="assigned-users">
            <button className="delete-button" onClick={handleDelete}>
              <Trash2 size={16} />
            </button>
          </div>
          <div className="task-metrics">
            <span className="metric">
              <Calendar size={16} />
              {new Date(task.due_date).toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;


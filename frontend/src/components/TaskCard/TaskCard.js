import React, { useState, useRef } from 'react';
import { Calendar, Trash2 } from 'lucide-react';
import './TaskCard.css';

function TaskCard({ task, onTaskUpdated, onTaskDeleted }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef(null);

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent card expansion when clicking delete
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          console.log('Task deleted successfully:', task._id);
          onTaskDeleted(task._id); // Notify parent to remove the task
          onTaskUpdated(); // Call to update the task list if needed
        } else {
          const errorData = await response.json();
          console.error('Failed to delete task:', errorData);
          alert(errorData.message || 'Failed to delete task');
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

  return (
    <div
      ref={cardRef}
      className={`task-card ${isExpanded ? 'expanded' : ''}`}
      onClick={() => setIsExpanded(!isExpanded)}
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', task._id)}
    >
      <div className="task-card-content">
        <div className="task-header">
          <div className="task-title-section">
            <h3 className="task-title">{task.title}</h3>
            <div className="task-badges">
              <span className="status-badge" style={{ backgroundColor: getStatusColor(task.status) }}>
                {task.status}
              </span>
              <span className="priority-badge" style={{ backgroundColor: getStatusColor(task.priority) }}>
                {task.priority}
              </span>
            </div>
          </div>
          <button className="delete-button" onClick={handleDelete}>
            <Trash2 size={16} />
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
              <div className="expanded-header">
                <h4>Details</h4>
                <span className="metric">
                  <Calendar size={16} />
                  {new Date(task.due_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
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
                    {new Date(task.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;

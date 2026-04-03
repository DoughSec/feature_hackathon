import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data);
      } catch (err) {
        setError('Failed to load task');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      const res = await api.put(`/tasks/${id}`, { ...task, status: newStatus });
      setTask(res.data);
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const updatePriority = async (id, newPriority) => {
    try {
      const res = await api.put(`/tasks/${id}`, { ...task, priority: newPriority });
      setTask(res.data);
    } catch (err) {
      setError('Failed to update task');
    }
  };


  const deleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      navigate('/tasks');
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'TODO': return 'To Do';
      case 'IN_PROGRESS': return 'In Progress';
      case 'DONE': return 'Done';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'TODO': return 'status-todo';
      case 'IN_PROGRESS': return 'status-in-progress';
      case 'DONE': return 'status-done';
      default: return '';
    }
  };

  if (loading) return <div className="loading">Loading task...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!task) return <div className="error-message">Task not found</div>;

  return (
    <div className="task-detail">
      <button onClick={() => navigate('/tasks')} className="btn btn-secondary back-btn">
        ← Back to Tasks
      </button>
      <div className="task-detail-card">
        <div className="task-detail-header">
          <h1>{task.title}</h1>
          <span className={`status-badge ${getStatusClass(task.status)}`}>
            {formatStatus(task.status)}
          </span>
        </div>
        <p className="task-detail-description">{task.description}</p>
        <div className="task-detail-meta">
          <span>Created by <strong>{task.createdBy}</strong></span>
          {task.createdAt && (
            <span> on {new Date(task.createdAt).toLocaleDateString()}</span>
          )}
        </div>
        <div className="task-detail-actions">
          <label>Update Status:</label>

          <select
            value={task.priority}
            onChange={(e) => updatePriority(task.id, e.target.value)}
            className="status-select"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <select
            value={task.status}
            onChange={(e) => updateStatus(e.target.value)}
            className="status-select"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          <button onClick={deleteTask} className="btn btn-danger">Delete Task</button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;

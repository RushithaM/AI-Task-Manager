import React, { useState, useEffect, useRef } from 'react';
import { List, CheckSquare, Calendar, AlertTriangle, BarChart } from 'lucide-react';
import { getGeminiResponse } from '../utils/gemini';
import './AIChatModal.css';

function AIChatModal({ isOpen, onClose, tasks, projectDetails }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        text: "Hello! I can help you manage tasks and provide project insights. Try asking me to:\n- List all tasks\n- Show completed tasks\n- Create a new task\n- Show project status",
        isUser: false
      }]);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isOpen]);

  const handleCreateTask = async (taskData) => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData)
      });
      
      if (!response.ok) throw new Error('Failed to create task');
      
      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData)
      });
      
      if (!response.ok) throw new Error('Failed to update task');
      
      return await response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      const userMessage = inputMessage.trim();
      setInputMessage('');
      setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
      setIsLoading(true);

      try {
        const response = await getGeminiResponse(userMessage, tasks, projectDetails);
        
        switch (response.type) {
          case 'CREATE_TASK':
            await handleCreateTask(response.data);
            setMessages(prev => [...prev, { 
              text: `✅ Task created successfully: "${response.data.title}"`, 
              isUser: false 
            }]);
            break;
            
          case 'UPDATE_TASK':
            await handleUpdateTask(response.data);
            setMessages(prev => [...prev, { 
              text: `✅ Task updated successfully`, 
              isUser: false 
            }]);
            break;
            
          case 'MESSAGE':
            setMessages(prev => [...prev, { 
              text: response.data, 
              isUser: false 
            }]);
            break;
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, { 
          text: "I apologize, but I encountered an error. Please try again or rephrase your request.", 
          isUser: false 
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const quickActions = [
    { 
      icon: <List size={16} />, 
      text: 'All Tasks',
      prompt: 'List all tasks'
    },
    { 
      icon: <CheckSquare size={16} />, 
      text: 'Completed',
      prompt: 'Show completed tasks'
    },
    { 
      icon: <Calendar size={16} />, 
      text: 'In Progress',
      prompt: 'Show in-progress tasks'
    },
    { 
      icon: <AlertTriangle size={16} />, 
      text: 'P0 Tasks',
      prompt: 'Show P0 priority tasks'
    },
    { 
      icon: <BarChart size={16} />, 
      text: 'Status',
      prompt: 'Show project status summary'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="ai-chat-modal">
      <div className="ai-chat-content">
        <div className="ai-chat-header">
          <h2>AI Task Assistant</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="ai-chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.isUser ? 'user' : 'ai'}`}>
              <div className="message-content">{message.text}</div>
            </div>
          ))}
          {isLoading && (
            <div className="message ai">
              <div className="message-content">Thinking...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="quick-action-button"
              onClick={() => {
                setInputMessage(action.prompt);
                handleSubmit({ preventDefault: () => {} });
              }}
            >
              {action.icon}
              <span>{action.text}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="ai-chat-input-form">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about tasks or type a command..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !inputMessage.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default AIChatModal;
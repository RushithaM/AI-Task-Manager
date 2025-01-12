import React, { useState, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';
import { getGeminiResponse } from '../utils/gemini';
import './AIChatModal.css';

function AIChatModal({ isOpen, onClose, projectData, onTaskAdded }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [creatingTask, setCreatingTask] = useState({ isCreating: false, step: 0, data: {} });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          text: "Hello! I'm your AI assistant for task management. How can I help you today?",
          isUser: false
        }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      const userMessage = inputMessage.trim();
      setInputMessage('');
      setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
      setIsLoading(true);

      if (creatingTask.isCreating) {
        handleTaskCreationStep(userMessage);
      } else {
        try {
          const response = await getGeminiResponse(userMessage, projectData);
          if (response.toLowerCase().includes('create task')) {
            setCreatingTask({ isCreating: true, step: 1, data: {} });
            setMessages(prev => [...prev, { text: "Great! Let's create a new task. What's the name of the task?", isUser: false }]);
          } else {
            setMessages(prev => [...prev, { text: response, isUser: false }]);
          }
        } catch (error) {
          console.error('Error getting AI response:', error);
          setMessages(prev => [...prev, { 
            text: "I apologize, but I'm having trouble processing your request at the moment. Please try again later.", 
            isUser: false 
          }]);
        }
      }
      setIsLoading(false);
    }
  };

  const handleTaskCreationStep = (userInput) => {
    const { step, data } = creatingTask;
    let nextStep = step + 1;
    let nextMessage = '';
    let updatedData = { ...data };

    switch (step) {
      case 1:
        updatedData.title = userInput;
        nextMessage = "What's the priority of the task? (P0, P1, or P2)";
        break;
      case 2:
        updatedData.priority = userInput;
        nextMessage = "Please provide a description for the task.";
        break;
      case 3:
        updatedData.description = userInput;
        nextMessage = "How many story points should be assigned to this task?";
        break;
      case 4:
        updatedData.sp_assigned = parseInt(userInput, 10);
        nextMessage = "What's the due date for this task? (YYYY-MM-DD)";
        break;
      case 5:
        updatedData.due_date = userInput;
        nextMessage = "Task created successfully! Here's a summary:\n" +
          `Title: ${updatedData.title}\n` +
          `Priority: ${updatedData.priority}\n` +
          `Description: ${updatedData.description}\n` +
          `Story Points: ${updatedData.sp_assigned}\n` +
          `Due Date: ${updatedData.due_date}`;
        createTask(updatedData);
        setCreatingTask({ isCreating: false, step: 0, data: {} });
        break;
    }

    setMessages(prev => [...prev, { text: nextMessage, isUser: false }]);
    setCreatingTask(prev => ({ ...prev, step: nextStep, data: updatedData }));
  };

  const createTask = async (taskData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      // Refresh project data after creating a task
      onTaskAdded();
    } catch (error) {
      console.error('Error creating task:', error);
      setMessages(prev => [...prev, { 
        text: "I'm sorry, but there was an error creating the task. Please try again later.", 
        isUser: false 
      }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chat-modal">
      <div className="ai-chat-content">
        <div className="ai-chat-header">
          <h2>AI Assistant</h2>
          <button className="ai-chat-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="ai-chat-body">
          <div className="ai-chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.isUser ? 'user' : 'ai'}`}>
                <div className="message-content">{message.text}</div>
              </div>
            ))}
            {isLoading && (
              <div className="message ai">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="ai-chat-input-container">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your tasks or project..."
              rows={1}
              className="ai-chat-input"
              disabled={isLoading}
            />
            <button type="submit" className="ai-chat-submit" disabled={isLoading || !inputMessage.trim()}>
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AIChatModal;


import React, { useState, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';
import { getGeminiResponse } from '../../utils/gemini';
import './AIChatModal.css';

function AIChatModal({ isOpen, onClose, projectData, onTaskAdded }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [creatingTask, setCreatingTask] = useState({ isCreating: false, step: 0, data: {} });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const preBuiltQuestions = [
    { icon: '🔥', text: 'Show tasks with priority P0' },
    { icon: '⚡', text: 'List all urgent tasks' },
    { icon: '📊', text: 'Show tasks by priority' },
    { icon: '📅', text: 'Which tasks are due today?' },
    { icon: '📆', text: 'Show tasks due this week' },
    { icon: '⏰', text: 'Display overdue tasks' },
    { icon: '✅', text: 'How many tasks are completed?' },
    { icon: '⏳', text: 'List all ongoing tasks' },
    { icon: '👤', text: 'List unassigned tasks' },
    { icon: '🚫', text: 'Total SP points assigned' },
    { icon: '📈', text: "What's the project progress?" },
    { icon: '🎯', text: 'Show milestone status' },
  ];

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          text: "Hello! I'm your AI assistant for task management. You can click the help icon to see suggested questions, or ask me anything about your tasks!",
          isUser: false,
        },
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatResponse = (response) => {
    response = response.replace(/\*\*/g, ''); // Remove bold markers
    response = response.replace(/^\s*\*\s+/gm, '- '); // Replace bullet points
    return response;
  };

  const handleSuggestionClick = (question) => {
    setInputMessage(question);
    handleSubmit({ preventDefault: () => {} }, question);
  };

  const handleSubmit = async (e, suggestedMessage = null) => {
    e.preventDefault();
    const messageToSend = suggestedMessage || inputMessage.trim();

    if (messageToSend && !isLoading) {
      setInputMessage('');
      setMessages((prev) => [...prev, { text: messageToSend, isUser: true }]);
      setIsLoading(true);

      if (creatingTask.isCreating) {
        handleTaskCreationStep(messageToSend);
      } else {
        try {
          const response = await getGeminiResponse(messageToSend, projectData);
          if (response.toLowerCase().includes('create task')) {
            setCreatingTask({ isCreating: true, step: 1, data: {} });
            setMessages((prev) => [
              ...prev,
              { text: "Great! Let's create a new task. What's the name of the task?", isUser: false },
            ]);
          } else {
            const formattedResponse = formatResponse(response);
            setMessages((prev) => [...prev, { text: formattedResponse, isUser: false }]);
          }
        } catch (error) {
          console.error('Error getting AI response:', error);
          setMessages((prev) => [
            ...prev,
            {
              text: "I apologize, but I'm having trouble processing your request at the moment. Please try again later.",
              isUser: false,
            },
          ]);
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
        nextMessage = 'Please provide a description for the task.';
        break;
      case 3:
        updatedData.description = userInput;
        nextMessage = 'How many story points should be assigned to this task?';
        break;
      case 4:
        updatedData.sp_assigned = parseInt(userInput, 10);
        nextMessage = "What's the due date for this task? (YYYY-MM-DD)";
        break;
      case 5:
        updatedData.due_date = userInput;
        nextMessage = `Task created successfully! Here's a summary:\n` +
          `Title: ${updatedData.title}\n` +
          `Priority: ${updatedData.priority}\n` +
          `Description: ${updatedData.description}\n` +
          `Story Points: ${updatedData.sp_assigned}\n` +
          `Due Date: ${updatedData.due_date}`;
        createTask(updatedData);
        setCreatingTask({ isCreating: false, step: 0, data: {} });
        break;
      default:
        nextMessage = "I'm not sure what to do next. Let's start over.";
        setCreatingTask({ isCreating: false, step: 0, data: {} });
    }

    setMessages((prev) => [...prev, { text: nextMessage, isUser: false }]);
    setCreatingTask((prev) => ({ ...prev, step: nextStep, data: updatedData }));
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

      onTaskAdded();
    } catch (error) {
      console.error('Error creating task:', error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm sorry, but there was an error creating the task. Please try again later.",
          isUser: false,
        },
      ]);
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
          <h2>AI Task Assistant</h2>
          <div className="ai-chat-header-actions">
            <button className="ai-chat-close" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
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
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-chat-input-section">
            <div className="quick-suggestions">
              {preBuiltQuestions.map((item, idx) => (
                <button
                  key={idx}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(item.text)}
                >
                  <span className="suggestion-icon">{item.icon}</span>
                  <span className="suggestion-text">{item.text}</span>
                </button>
              ))}
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
              <button
                type="submit"
                className="ai-chat-submit"
                disabled={isLoading || !inputMessage.trim()}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIChatModal;

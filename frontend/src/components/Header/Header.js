// Header.js
import React from 'react';
import { Plus, Bot } from 'lucide-react';
import './Header.css';

function Header({ setShowAIChat, setShowAddForm }) {
  return (
    <header className="app-header">
      <h1 className="app-title">AI Task Manager</h1>
      <div className="header-buttons">
        <button className="ai-button" onClick={() => setShowAIChat(true)}>
          <Bot size={20} />
          Ask AI
        </button>
        <button className="create-task-button" onClick={() => setShowAddForm(true)}>
          <Plus size={20} />
          Create Task
        </button>
      </div>
    </header>
  );
}

export default Header;

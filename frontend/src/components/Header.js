import React, { useState } from 'react';
import './Header.css';

function Header() {
  const [buttonLabel, setButtonLabel] = useState('Ask AI');

  const handleButtonClick = () => {
    alert("Button clicked!");
    setButtonLabel('Processing...');
    setTimeout(() => {
      setButtonLabel('Ask AI');
    }, 2000);
  };

  return (
    <header className="header">
      <h1>AI Task Manager</h1>
      <div className="header-buttons">
        <button className="ask-ai-btn" onClick={handleButtonClick}>
          {buttonLabel}
        </button>
        <button className="create-task-btn"> + Create Task</button>
      </div>
    </header>
  );
}

export default Header;


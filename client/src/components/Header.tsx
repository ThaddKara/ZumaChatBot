import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1>🤖 ZumaChatBot</h1>
            <span className="subtitle">AI Assistant</span>
          </div>
          <div className="status">
            <span className="status-indicator online"></span>
            <span className="status-text">Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import styles from './ChatBot.module.css';

function ChatBot({ isOpen, onToggle, isOtherOpen }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={styles.chatBotContainer}>
      {/* Chat Window */}
      <div className={`${styles.chatWindow} ${isOpen ? styles.chatWindowOpen : ''}`}>
        <div className={styles.chatHeader}>
          <h3 className={styles.chatTitle}>
            <Bot size={20} /> AI Assistant
          </h3>
          <button className={styles.closeButton} onClick={onToggle}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.chatBody}>
          <div className={styles.welcomeText}>
            <p>Hello! I am AI Assistant</p>
            <p>I can answer your dental questions, ask me questions now</p>
          </div>
        </div>

        <div className={styles.chatInputWrapper}>
          <input
            type="text"
            className={styles.chatInput}
            placeholder="Enter your message..."/>
          <button className={styles.sendButton}>Send</button>
        </div>
      </div>

      {/* ChatBot Button */}
      {!isOpen && !isOtherOpen && (
        <button
          className={`${styles.chatBotButton} ${styles.pulse} ${isHovered ? styles.chatBotButtonHover : ''}`}
          onClick={onToggle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Open ChatBot">
          <Bot size={24} />
        </button>
      )}
    </div>
  );
}

export default ChatBot;

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import styles from './Messenger.module.css';

function Messenger({ isOpen, onToggle, isOtherOpen }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={styles.messengerContainer}>
      <div
        className={`${styles.chatWindow} ${isOpen ? styles.chatWindowOpen : ''}`}>
        <div className={styles.chatHeader}>
          <h3 className={styles.chatTitle}>Gentle Care Dental</h3>
          <button className={styles.closeButton} onClick={onToggle}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.chatBody}>
          <div className={styles.welcomeText}>
            <p>Hello! 👋</p>
            <p>Chat with customer service right here!</p>
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

      {/* Messenger Button */}
      {!isOpen && !isOtherOpen && (
        <button
          className={`${styles.messengerButton} ${styles.pulse} ${isHovered ? styles.messengerButtonHover : ''}`}
          onClick={onToggle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Open Messenger">
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}

export default Messenger;
